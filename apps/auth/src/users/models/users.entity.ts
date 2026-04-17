import { AbstractEntity } from '@app/common/database';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { RolesEntity } from './roles.entity';

@Entity()
export class UserEntity extends AbstractEntity<UserEntity> {
  @Column()
  email: string;

  @Column()
  password: string;

  @ManyToMany(() => RolesEntity, {
    cascade: true,
  })
  @JoinTable()
  roles?: RolesEntity[];
}
