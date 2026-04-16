import { AbstractRepository } from '@app/common/database/abstract.repository';
import { Injectable, Logger } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { RolesEntity } from './models/roles.entity';

@Injectable()
export class RolesRepository extends AbstractRepository<RolesEntity> {
  protected readonly logger = new Logger(RolesRepository.name);

  constructor(
    @InjectRepository(RolesEntity)
    roleRepository: Repository<RolesEntity>,
    @InjectEntityManager() entityManager: EntityManager,
  ) {
    super(roleRepository, entityManager);
  }
}
