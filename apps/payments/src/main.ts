import { NestFactory } from '@nestjs/core';
import { PaymentsModule } from './payments.module';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(PaymentsModule);
  const configService = app.get(ConfigService);
  const port = configService.getOrThrow<number>('PAYMENTS_PORT');
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port,
    },
  });
  app.useLogger(app.get(Logger));
  await app.startAllMicroservices();
  console.info(`Payments TCP microservice is listening on port ${port}`);
}
bootstrap();
