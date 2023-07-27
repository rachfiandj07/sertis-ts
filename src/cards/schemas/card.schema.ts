import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CardDocument = Card & Document;

@Schema()
export class Card {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  status: boolean;

  @Prop()
  content: string;

  @Prop()
  category: string;

  @Prop()
  author_id: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  deletedAt: Date;
}

export const CardSchema = SchemaFactory.createForClass(Card);
