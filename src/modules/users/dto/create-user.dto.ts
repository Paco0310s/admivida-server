import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsPhoneNumber,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { UserRole } from 'src/common/enums/user.roles.enum';

export class CreateUserDto {
  @IsString({ message: 'FIRSTNAME_REQUIRED' })
  @IsNotEmpty({ message: 'FIRSTNAME_REQUIRED' })
  @MaxLength(100, { message: 'FIRSTNAME_TOO_LONG' })
  firstname!: string;

  @IsString({ message: 'LASTNAME_REQUIRED' })
  @IsNotEmpty({ message: 'LASTNAME_REQUIRED' })
  @MaxLength(100, { message: 'LASTNAME_TOO_LONG' })
  lastname!: string;

  @IsPhoneNumber(undefined, { message: 'PHONE_INVALID' })
  @IsNotEmpty({ message: 'PHONE_REQUIRED' })
  phone!: string;

  @IsEmail({}, { message: 'INVALID_EMAIL' })
  @IsNotEmpty({ message: 'EMAIL_REQUIRED' })
  email!: string;

  @IsString({ message: 'PASSWORD_REQUIRED' })
  @IsNotEmpty({ message: 'PASSWORD_REQUIRED' })
  @MinLength(8, { message: 'PASSWORD_TOO_SHORT' })
  password!: string;

  @IsEnum(UserRole, { message: 'INVALID_ROLE' })
  @IsOptional()
  role?: UserRole;
}
