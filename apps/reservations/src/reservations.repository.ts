import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common/database/abstract.repository';
import { ReservationEntity } from './models/reservation.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ReservationsRepository extends AbstractRepository<ReservationEntity> {
  protected readonly logger = new Logger(ReservationsRepository.name);

  constructor(
    @InjectRepository(ReservationEntity)
    reservationRepository: Repository<ReservationEntity>,
    @InjectEntityManager() entityManager: EntityManager,
  ) {
    super(reservationRepository, entityManager);
  }
}
