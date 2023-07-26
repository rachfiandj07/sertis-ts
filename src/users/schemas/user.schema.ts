import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  id: string;

  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop()
  createdAt: string;

  @Prop()
  updatedAt: string;

  @Prop()
  deletedAt: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
