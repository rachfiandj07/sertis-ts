import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDTO {
  @IsNotEmpty({ message: "Username can't be empty " })
  @IsString({ message: 'Username must contain string ' })
  @MinLength(5, { message: 'Username must be more than 5 words' })
  @ApiProperty({
    description: 'Username',
    minimum: 5,
    default: 'naufalman123',
    type: String,
  })
  readonly username: string;
}
