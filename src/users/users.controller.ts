import { Body, Controller, Post } from '@nestjs/common';
import { SignUpDTO } from 'src/users/dto/signUp.dto';
import { SignInDTO } from './dto/signIn.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('/signup')
  signUp(@Body() signUpDto: SignUpDTO): Promise<{ token: string }> {
    return this.userService.signUp(signUpDto);
  }

  @Post('/signin')
  signIn(@Body() signInDto: SignInDTO): Promise<{ token: string }> {
    return this.userService.signIn(signInDto);
  }
}
