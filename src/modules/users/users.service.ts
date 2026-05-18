import { Injectable, ConflictException, Inject } from '@nestjs/common';
import { BaseService } from 'src/common/services/base.service';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ConflictEmailException } from 'src/common/exceptions/custom-http.exception';
import { UserRole } from 'src/common/enums/user.roles.enum';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  // Helper to generate 9 random digits formatted as XXX-XXX-XXX
  private generateFormattedCode(): string {
    const generateSegment = () =>
      Math.floor(100 + Math.random() * 900).toString();
    return `${generateSegment()}-${generateSegment()}-${generateSegment()}`;
  }

  // Loops until a completely unique code is generated
  async generateUniqueUserCode(): Promise<string> {
    let code = this.generateFormattedCode();
    // Using 'this.userRepository' which matches your constructor injection
    let exists = await this.userRepository.findOne({ where: { code } });

    while (exists) {
      code = this.generateFormattedCode();
      exists = await this.userRepository.findOne({ where: { code } });
    }

    return code;
  }

  // Handles registration with email uniqueness, code injection, and password hashing
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto;

    const emailExists = await this.userRepository.findOne({ where: { email } });
    if (emailExists) {
      throw new ConflictEmailException();
    }

    const uniqueCode = await this.generateUniqueUserCode();
    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      ...createUserDto,
      code: uniqueCode,
      password: hashedPassword,
      role: createUserDto.role || UserRole.USER,
    };

    // Invokes the parent BaseService create logic
    return await this.create(userData);
  }

  // Look up users by code
  async findByCode(code: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { code, isActive: true },
    });
  }
}
