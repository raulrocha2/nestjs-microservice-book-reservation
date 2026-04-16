import { AbstractEntity } from '@app/common/database';
import { Column, Entity } from 'typeorm';

@Entity()
export class ReservationEntity extends AbstractEntity<ReservationEntity> {
  @Column()
  timestamp: Date;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  userId: number;

  @Column()
  invoiceId: string;
}
