import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignUpDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  readonly username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  readonly password: string;
}
