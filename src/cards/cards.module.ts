import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { CardSchema } from './schemas/card.schema';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: 'Card', schema: CardSchema }]),
  ],
  controllers: [CardsController],
  providers: [CardsService],
})
export class CardsModule {}
