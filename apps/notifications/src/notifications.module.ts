import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '@app/common/logger';
import * as Joi from 'joi';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { LoggingInterceptor } from '@app/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NOTIFICATIONS_PORT: Joi.number().required(),
        RABBITMQ_URI: Joi.string().required(),
        RABBITMQ_QUEUE: Joi.string().required(),
        EMAIL_HOST: Joi.string().required(),
        EMAIL_PORT: Joi.number().required(),
        GMAIL_EMAIL: Joi.string().required(),
        GMAIL_PASSWORD: Joi.string().required(),
        EMAIL_FROM: Joi.string().required(),
      }),
    }),
    LoggerModule,
    PrometheusModule.register(),
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class NotificationsModule {}
