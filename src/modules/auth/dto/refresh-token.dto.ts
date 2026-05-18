import { IsString, IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @IsString({ message: 'REFRESH_TOKEN_INVALID' })
  @IsNotEmpty({ message: 'REFRESH_TOKEN_REQUIRED' })
  refreshToken!: string;
}
