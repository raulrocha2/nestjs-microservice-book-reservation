import { AbstractEntity } from '@app/common/database';
import { Column, Entity } from 'typeorm';

@Entity()
export class RolesEntity extends AbstractEntity<RolesEntity> {
  @Column()
  name: string;
}
