import {
  IsBoolean,
  IsEmpty,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '../../users/schemas/user.schema';
import { Category } from '../schemas/card.schema';

export class UpdateCardDTO {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Card Name',
    default: 'Math',
    type: String,
  })
  readonly name: string;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({
    description: 'Card Status',
    minimum: 5,
    default: false,
    type: Boolean,
  })
  readonly status: boolean;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Card Content',
    default: 'Lorem ipsum dolor sit amet',
    type: String,
  })
  readonly content: string;

  @IsOptional()
  @IsEnum(Category, { message: 'Please enter correct category.' })
  @ApiPropertyOptional({
    name: 'category',
    description: 'Card Category',
    enum: Category,
  })
  readonly category: Category;

  @IsEmpty({ message: 'You are not the owner of card' })
  readonly user: User;
}
