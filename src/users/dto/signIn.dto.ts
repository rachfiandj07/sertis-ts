import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDTO {
  @IsNotEmpty({ message: "Username can't be empty " })
  @IsString({ message: 'Username must contain string ' })
  @MinLength(5, { message: 'Username must be more than 5 words' })
  @ApiProperty({
    description: 'Username',
    minimum: 5,
    default: 'bumblebee123',
    type: String,
  })
  readonly username: string;

  @IsNotEmpty({ message: "Password can't be empty " })
  @IsString({ message: 'Password must contain string ' })
  @MinLength(5, { message: 'Password must be more than 5 words' })
  @ApiProperty({
    description: 'Password',
    minimum: 5,
    default: 'optimusprime11',
    type: String,
  })
  readonly password: string;
}
