import {
  IsBoolean,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/schemas/user.schema';
import { Category } from '../schemas/card.schema';

export class CreateCardDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Card Name',
    default: 'Quantum Physics',
    type: String,
  })
  readonly name: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    description: 'Card Status',
    minimum: 5,
    default: true,
    type: Boolean,
  })
  readonly status: boolean;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Card Content',
    default: 'Lorem ipsum dolor sit amet',
    type: String,
  })
  readonly content: string;

  @IsNotEmpty()
  @IsEnum(Category, { message: 'Please enter correct category.' })
  @ApiProperty({
    name: 'category',
    description: 'Card Category',
    default: 'Technology',
    enum: Category,
  })
  readonly category: Category;

  @IsEmpty()
  readonly user: User;
}
