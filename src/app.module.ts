import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { CardsController } from './cards/cards.controller';
import { CardsService } from './cards/cards.service';
import { UsersService } from './users/users.service';
import { CardsModule } from './cards/cards.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    MongooseModule.forRoot(`${process.env.MONGODB_URL}`),
    CardsModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController, UsersController, CardsController],
  providers: [AppService, CardsService, UsersService],
})
export class AppModule {}
