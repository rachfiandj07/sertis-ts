import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignInDTO {
  @IsNotEmpty({ message: "Username can't be empty " })
  @IsString({ message: 'Username must contain string ' })
  @MinLength(5, { message: 'Username must be more than 5 words' })
  readonly username: string;

  @IsNotEmpty({ message: "Password can't be empty " })
  @IsString({ message: 'Password must contain string ' })
  @MinLength(5, { message: 'Password must be more than 5 words' })
  readonly password: string;
}
