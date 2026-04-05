import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '@app/common/logger';
import * as Joi from 'joi';

@Module({
  imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        validationSchema: Joi.object({
          NOTIFICATIONS_PORT: Joi.number().required(),
          RABBITMQ_URI: Joi.string().required(),
          RABBITMQ_QUEUE: Joi.string().required(),
        }),
      }),
      LoggerModule, 
    ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
