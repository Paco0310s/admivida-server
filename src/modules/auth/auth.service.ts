import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import {
  InvalidCredentialsException,
  UserNotFoundException,
  InvalidTokenException,
  RefreshTokenExpiredException,
} from 'src/common/exceptions/custom-http.exception';
import { JwtPayload } from './strategies/jwt.strategy';
import { envs } from 'src/common/config/envs';

@Injectable()
export class AuthService {
  private readonly ACCESS_TOKEN_EXPIRATION = 900; // 15 minutes
  private readonly REFRESH_TOKEN_EXPIRATION = 604800; // 7 days

  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<User>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<RegisterResponseDto> {
    // Use UsersService.createUser which handles code generation and password hashing
    const user = await this.usersService.createUser(createUserDto);

    // Generate tokens
    const authResponse = this.generateAuthResponse(user);

    return {
      ...authResponse,
      user,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    // Find user by email (need to select password field)
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.password')
      .getOne();

    if (!user) {
      throw new UserNotFoundException();
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
    }

    // Generate tokens
    return this.generateAuthResponse(user);
  }

  async refreshToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<AuthResponseDto> {
    try {
      const payload = this.jwtService.verify<JwtPayload>(
        refreshTokenDto.refreshToken,
        {
          secret: envs.jwtSecret,
        },
      );

      // Find user
      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });
      if (!user) {
        throw new UserNotFoundException();
      }

      // Generate new tokens
      return this.generateAuthResponse(user);
    } catch (error) {
      if ((error as any).name === 'TokenExpiredError') {
        throw new RefreshTokenExpiredException();
      }
      throw new InvalidTokenException();
    }
  }

  private generateAuthResponse(user: User): AuthResponseDto {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: envs.jwtSecret,
      expiresIn: this.ACCESS_TOKEN_EXPIRATION,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: envs.jwtSecret,
      expiresIn: this.REFRESH_TOKEN_EXPIRATION,
    });

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: this.ACCESS_TOKEN_EXPIRATION,
    };
  }
}
