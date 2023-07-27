import {
  IsBoolean,
  IsEmpty,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { User } from '../../users/schemas/user.schema';
import { Category } from '../schemas/card.schema';

export class UpdateCardDTO {
  @IsOptional()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsBoolean()
  readonly status: boolean;

  @IsOptional()
  @IsString()
  readonly content: string;

  @IsOptional()
  @IsEnum(Category, { message: 'Please enter correct category.' })
  readonly category: Category;

  @IsEmpty({ message: 'You are not the owner of card' })
  readonly user: User;
}
