import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseEntity {
  @ApiProperty({
    description: 'Unique UUID identifier of the record',
    example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
  })
  @PrimaryGeneratedColumn('uuid') // Automatically generates UUIDv4 on insert
  id!: string;

  @ApiProperty({
    description: 'Date and time when the record was created',
    example: '2026-05-16T15:00:00Z',
  })
  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
    comment: 'Date and time when the record was created',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Date and time of the last update to the record',
    example: '2026-05-16T15:00:00Z',
  })
  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
    comment: 'Date and time of the last update to the record',
  })
  updatedAt!: Date;

  @ApiProperty({
    description: 'Date and time of the soft deletion of the record',
    example: null,
    required: false,
  })
  @DeleteDateColumn({
    type: 'timestamp',
    name: 'deleted_at',
    nullable: true,
    default: null,
    comment: 'Date and time of the soft deletion of the record',
  })
  deletedAt!: Date | null;

  @ApiProperty({
    description: 'UUID of the user who created the record',
    example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    required: false,
  })
  @Column({
    type: 'varchar',
    length: 36, // Standard length for a string UUID
    name: 'created_by',
    nullable: true,
    comment: 'UUID of the user who created the record',
  })
  createdBy!: string | null;

  @ApiProperty({
    description: 'UUID of the user who updated the record',
    example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    required: false,
  })
  @Column({
    type: 'varchar',
    length: 36,
    name: 'updated_by',
    nullable: true,
    comment: 'UUID of the user who updated the record',
  })
  updatedBy!: string | null;

  @ApiProperty({
    description: 'UUID of the user who deleted the record',
    example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    required: false,
  })
  @Column({
    type: 'varchar',
    length: 36,
    name: 'deleted_by',
    nullable: true,
    comment: 'UUID of the user who deleted the record',
  })
  deletedBy!: string | null;
}
