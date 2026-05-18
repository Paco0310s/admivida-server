import { BaseEntity } from 'src/common/entities/base.entity';
import { Entity, Column, Index } from 'typeorm';
import { UserRole } from 'src/common/enums/user.roles.enum';

@Entity('users')
export class User extends BaseEntity {
  @Index({ unique: true })
  @Column({
    type: 'char',
    length: 11,
    nullable: false,
    comment: '9-digit unique code separated with hyphens (e.g., 123-456-789)',
  })
  code!: string;

  @Column({ name: 'first_name', length: 100 })
  firstname!: string;

  @Column({ name: 'last_name', length: 100 })
  lastname!: string;

  @Column({ length: 20 })
  phone!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ select: false }) // Avoids returning the password in queries by default
  password!: string;

  @Column({ 
    type: 'enum', 
    enum: UserRole, 
    default: UserRole.USER 
  })
  role!: UserRole;

  @Column({ name: 'is_active', default: true })
  isActive!: boolean;
}
