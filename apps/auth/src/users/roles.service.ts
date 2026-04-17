import { Injectable, NotFoundException } from '@nestjs/common';
import { RolesEntity } from './models/roles.entity';
import { RolesRepository } from './roles.repository';
import { CreateRoleDto } from './dto/create-role-dto';

@Injectable()
export class RolesService {
  constructor(private readonly rolesRepository: RolesRepository) {}

  async createRole(createRoleDto: CreateRoleDto) {
    return this.rolesRepository.create(new RolesEntity(createRoleDto));
  }

  async findByName(name: string): Promise<RolesEntity> {
    return this.rolesRepository.findOneByFilter({ name });
  }

  async findOrCreate(name: string): Promise<RolesEntity> {
    try {
      return await this.findByName(name);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return this.createRole(new CreateRoleDto({ name }));
      }
      throw error;
    }
  }
}
