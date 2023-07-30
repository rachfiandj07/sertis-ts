import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignUpDTO {
  @IsNotEmpty({ message: "Username can't be empty " })
  @IsString({ message: 'Username must contain string ' })
  @MinLength(5, { message: 'Username must be more than 5 words' })
  readonly username: string;
}
