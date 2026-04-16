import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { GetUserDto } from './dto/get-user.dto';
import { UserEntity } from './models/users.entity';
import { RolesService } from './roles.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly rolesService: RolesService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    await this.userAlreadyExists(createUserDto.email);
    const roles = await Promise.all(
      createUserDto.roles?.map((role) =>
        this.rolesService.findOrCreate(role.name),
      ) ?? [],
    );
    const user = new UserEntity({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
      roles: roles,
    });
    return this.usersRepository.create(user);
  }

  async verifyUser({ email, password }: { email: string; password: string }) {
    const user = await this.usersRepository.findOneByFilter({ email });

    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async userAlreadyExists(email: string) {
    try {
      await this.usersRepository.findOneByFilter({ email });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return;
      }
      throw error;
    }
    throw new UnprocessableEntityException('User already exists');
  }

  async findById(getUserDto: GetUserDto) {
    const user = await this.usersRepository.findOneByFilter(getUserDto, {
      roles: true,
    });
    return user;
  }
}
