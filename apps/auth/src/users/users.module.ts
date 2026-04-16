import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { DatabaseModule } from '@app/common/database';
import { UserEntity } from './models/users.entity';
import { LoggerModule } from '@app/common/logger';
import { RolesEntity } from './models/roles.entity';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { RolesService } from './roles.service';
import { RolesRepository } from './roles.repository';
@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([UserEntity, RolesEntity]),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MYSQL_DATABASE: Joi.string().required(),
        MYSQL_USER: Joi.string().required(),
        MYSQL_PASSWORD: Joi.string().required(),
        MYSQL_HOST: Joi.string().required(),
        MYSQL_PORT: Joi.number().required(),
        MYSQL_SYNCHRONIZE: Joi.boolean().required(),
      }),
    }),
    LoggerModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, RolesService, RolesRepository],
  exports: [UsersService],
})
export class UsersModule {}
