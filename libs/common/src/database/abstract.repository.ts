/* eslint-disable @typescript-eslint/no-unsafe-call */
import { AbstractEntity } from './abstract.entity';
import { Logger, NotFoundException } from '@nestjs/common';
import {
  DeepPartial,
  EntityManager,
  FindOptionsRelations,
  FindOptionsWhere,
  QueryDeepPartialEntity,
  Repository,
} from 'typeorm';

export abstract class AbstractRepository<T extends AbstractEntity<T>> {
  protected readonly logger!: Logger;
  constructor(
    protected readonly repository: Repository<T>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(entity: T): Promise<T> {
    return await this.repository.save(entity);
  }

  async findOneByFilter(
    where: FindOptionsWhere<T>,
    relations?: FindOptionsRelations<T>,
  ): Promise<T> {
    const newEntity = await this.repository.findOne({ where, relations });
    if (!newEntity) {
      this.logger.warn(
        `Entity not found with filter: ${JSON.stringify(where)}`,
      );
      throw new NotFoundException('Entity not found');
    }
    return newEntity as T;
  }

  async findOneAndUpdate(
    query: FindOptionsWhere<T>,
    update: QueryDeepPartialEntity<T>,
  ): Promise<T> {
    const updatedEntity = await this.repository.update(query, update);
    if (!updatedEntity.affected) {
      this.logger.warn(
        `Entity not found with filter: ${JSON.stringify(query)}`,
      );
      throw new NotFoundException('Entity not found');
    }
    return this.findOneByFilter(query);
  }
  async find(where: FindOptionsWhere<T>): Promise<T[]> {
    return this.repository.find({ where });
  }

  async findOneAndDelete(where: FindOptionsWhere<T>): Promise<void> {
    const deletedEntity = await this.repository.delete(where);
    if (!deletedEntity.affected) {
      this.logger.warn(
        `Entity not found with filter: ${JSON.stringify(where)}`,
      );
      throw new NotFoundException('Entity not found');
    }
  }
}
