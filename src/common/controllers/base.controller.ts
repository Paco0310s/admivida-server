import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { BaseEntity } from '../entities/base.entity';
import { BaseService } from '../services/base.service';

export abstract class BaseController<
  T extends BaseEntity,
  CreateDto = any,
  UpdateDto = any,
> {
  constructor(protected readonly baseService: BaseService<T>) {}

  @Post()
  @ApiOperation({ summary: 'Create a new record' })
  async create(
    @Body() createDto: CreateDto,
    @Query('userId') userId?: string,
  ): Promise<T> {
    return await this.baseService.create(createDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all active records' })
  @ApiQuery({
    name: 'includeDeleted',
    required: false,
    enum: ['true', 'false'],
  })
  async findAll(
    @Query('includeDeleted') includeDeleted?: string,
  ): Promise<T[]> {
    const hasDeleted = includeDeleted === 'true';
    return await this.baseService.findAll(hasDeleted);
  }

  @Get('deleted')
  @ApiOperation({ summary: 'Retrieve all soft-deleted records' })
  async findDeleted(): Promise<T[]> {
    return await this.baseService.findDeleted();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single record by ID' })
  @ApiParam({ name: 'id', description: 'The unique UUID identifier' })
  async findOne(
    @Param('id') id: string,
    @Query('includeDeleted') includeDeleted?: string,
  ): Promise<T> {
    const hasDeleted = includeDeleted === 'true';
    return await this.baseService.findOne(id, hasDeleted);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing record' })
  @ApiParam({ name: 'id', description: 'The unique UUID identifier' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateDto,
    @Query('userId') userId?: string,
  ): Promise<T> {
    return await this.baseService.update(id, updateDto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a record' })
  @ApiParam({ name: 'id', description: 'The unique UUID identifier' })
  async remove(
    @Param('id') id: string,
    @Query('userId') userId?: string,
  ): Promise<T> {
    return await this.baseService.remove(id, userId);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restore a soft-deleted record' })
  @ApiParam({ name: 'id', description: 'The unique UUID identifier' })
  async restore(
    @Param('id') id: string,
    @Query('userId') userId?: string,
  ): Promise<T> {
    return await this.baseService.restore(id, userId);
  }

  @Delete(':id/force')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Permanently hard delete a record' })
  @ApiParam({ name: 'id', description: 'The unique UUID identifier' })
  async forceDelete(@Param('id') id: string): Promise<void> {
    await this.baseService.forceDelete(id);
  }
}
