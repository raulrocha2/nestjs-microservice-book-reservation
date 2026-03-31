import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { DatabaseModule } from '@app/common/database';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDocument, UserSchema } from './models/users.schema';
import { LoggerModule } from '@app/common/logger';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
    ]),
    LoggerModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
