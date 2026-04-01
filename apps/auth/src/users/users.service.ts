import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersRepository } from "./users.repository";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrypt from 'bcryptjs';
import { Types } from "mongoose";
import { GetUserDto } from "./dto/get-user.dto";

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(createUserDto: CreateUserDto) {
    return this.usersRepository.create({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    });
  }

  async verifyUser({email, password}: {email: string, password: string}) {
    const user = await this.usersRepository.findOneByFilter({ email });
   
    if (!await bcrypt.compare(password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async findById({id}: GetUserDto) {
    return this.usersRepository.findOneByFilter({ _id: new Types.ObjectId(id) });
  }
}