import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export enum Category {
  PHYSICS = 'Physics',
  TECHNOLOGY = 'Technology',
  CHEMISTRY = 'Chemistry',
  Sociology = 'Sociology',
}

@Schema({
  timestamps: true,
})
export class Card {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  status: boolean;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  category: Category;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;
}

export const CardSchema = SchemaFactory.createForClass(Card);
