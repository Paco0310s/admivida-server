import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsBoolean({ message: 'IS_ACTIVE_INVALID' })
  @IsOptional()
  isActive?: boolean;
}
