import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { LoggerModule } from '@app/common/logger';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NOTIFICATIONS_SERVICE } from '@app/common/constants/services';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PAYMENTS_PORT: Joi.number().required(),
        STRIPE_SECRET_KEY: Joi.string().required(),
        RABBITMQ_URI: Joi.string().required(),
        RABBITMQ_QUEUE: Joi.string().required(),
      }),
    }),
    LoggerModule, 
     ClientsModule.registerAsync([
          {
            name: NOTIFICATIONS_SERVICE,
            useFactory: (configService: ConfigService) => ({
              transport: Transport.RMQ,
              options: {
                urls: [configService.getOrThrow<string>('RABBITMQ_URI')],
                queue: configService.getOrThrow<string>('RABBITMQ_NOTIFICATIONS_QUEUE'),
                persistent: true,
                queueOptions: {
                  durable: true,
                },
              },
            }),
            inject: [ConfigService],
          }
        ]),
      ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
