import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Repository,
  FindOptionsWhere,
  IsNull,
  Not,
  DeepPartial,
} from 'typeorm';
import { BaseEntity } from '../entities/base.entity';

@Injectable()
export abstract class BaseService<T extends BaseEntity> {
  constructor(protected readonly repository: Repository<T>) {}

  async create(createDto: any, userId?: string): Promise<T> {
    const data = {
      ...createDto,
      createdBy: userId || null,
      updatedBy: userId || null,
    };

    // Al usar DeepPartial<T>, TypeORM sabe que 'entity' es un objeto único y no un array
    const entity = this.repository.create(data as DeepPartial<T>);
    return await this.repository.save(entity);
  }

  async findAll(includeDeleted = false): Promise<T[]> {
    return await this.repository.find({
      where: includeDeleted
        ? {}
        : ({ deletedAt: IsNull() } as FindOptionsWhere<T>),
      order: { createdAt: 'DESC' } as any,
      withDeleted: includeDeleted,
    });
  }

  async findOne(id: string, includeDeleted = false): Promise<T> {
    // TypeORM casting to FindOptionsWhere to handle generic ID lookup safely
    const entity = await this.repository.findOne({
      where: { id } as FindOptionsWhere<T>,
      withDeleted: includeDeleted,
    });

    if (!entity || (!includeDeleted && entity.deletedAt)) {
      throw new NotFoundException(`Record with ID ${id} not found`);
    }

    return entity;
  }

  async update(id: string, updateDto: any, userId?: string): Promise<T> {
    // Ensures the record exists before updating
    await this.findOne(id);

    const data = {
      id, // Pass ID to preload to ensure it merges into the correct record
      ...updateDto,
      updatedBy: userId,
    };

    const updatedEntity = await this.repository.preload(data as DeepPartial<T>);

    if (!updatedEntity) {
      throw new NotFoundException(`Record with ID ${id} could not be updated`);
    }

    return await this.repository.save(updatedEntity);
  }

  async remove(id: string, userId?: string): Promise<T> {
    const entity = await this.findOne(id);

    // 1. Update the auditor field first
    entity.deletedBy = userId || null; // Explicitly set to null if userId is undefined
    await this.repository.save(entity);

    // 2. Execute TypeORM's native soft remove (populates deletedAt automatically)
    return await this.repository.softRemove(entity);
  }

  async restore(id: string, userId?: string): Promise<T> {
    const entity = await this.findOne(id, true);

    if (!entity.deletedAt) {
      throw new NotFoundException(`Record with ID ${id} is not deleted`);
    }

    // Explicitly clearing audit fields since they are typed as 'number | null'
    entity.deletedAt = null;
    entity.deletedBy = null;
    entity.updatedBy = userId || null; // Explicitly set to null if userId is undefined

    return await this.repository.save(entity);
  }

  async forceDelete(id: string): Promise<void> {
    const entity = await this.findOne(id, true);
    await this.repository.remove(entity);
  }

  async findDeleted(): Promise<T[]> {
    return await this.repository.find({
      where: { deletedAt: Not(IsNull()) } as FindOptionsWhere<T>,
      order: { deletedAt: 'DESC' } as any,
      withDeleted: true,
    });
  }
}
