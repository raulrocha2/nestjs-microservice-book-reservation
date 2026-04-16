import { AbstractRepository } from '@app/common/database/abstract.repository';
import { Injectable, Logger } from '@nestjs/common';
import { UserEntity } from './models/users.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersRepository extends AbstractRepository<UserEntity> {
  protected readonly logger = new Logger(UsersRepository.name);

  constructor(
    @InjectRepository(UserEntity)
    userRepository: Repository<UserEntity>,
    @InjectEntityManager() entityManager: EntityManager,
  ) {
    super(userRepository, entityManager);
  }
}
