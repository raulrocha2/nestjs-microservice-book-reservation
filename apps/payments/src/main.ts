import { NestFactory } from '@nestjs/core';
import { PaymentsModule } from './payments.module';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(PaymentsModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.getOrThrow('RABBITMQ_URI')],
      queue: configService.getOrThrow('RABBITMQ_QUEUE'),
      prefetchCount: 1,
      queueOptions: {
        durable: true,
      },
    },
  });
  app.useLogger(app.get(Logger));
  await app.startAllMicroservices();
  console.info(
    `Payments RMQ microservice is listening on queue: ${configService.getOrThrow('RABBITMQ_QUEUE')}`,
  );
  await app.listen(configService.get('PAYMENTS_PORT') as number);
  console.info(
    `Payments service is running on port ${configService.get('PAYMENTS_PORT')}`,
  );
}
bootstrap();
