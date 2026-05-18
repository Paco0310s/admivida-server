import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/modules/users/entities/user.entity';
import { AuthResponseDto } from './auth-response.dto';

export class RegisterResponseDto extends AuthResponseDto {
  @ApiProperty({
    description: 'Newly created user object',
    type: User,
  })
  user!: User;
}
