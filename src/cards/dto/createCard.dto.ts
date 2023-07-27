import {
  IsBoolean,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { User } from '../../users/schemas/user.schema';
import { Category } from '../schemas/card.schema';

export class CreateCardDTO {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsBoolean()
  readonly status: boolean;

  @IsNotEmpty()
  @IsString()
  readonly content: string;

  @IsNotEmpty()
  @IsEnum(Category, { message: 'Please enter correct category.' })
  readonly category: Category;

  @IsEmpty()
  readonly user: User;
}
