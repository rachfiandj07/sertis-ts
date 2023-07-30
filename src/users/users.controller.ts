import { Body, Controller, Post } from '@nestjs/common';
import { SignUpDTO } from './dto/signUp.dto';
import { SignInDTO } from './dto/signIn.dto';
import { CreateUserResponse, LoginUserResponse } from './interface/user';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('/signup')
  signUp(@Body() signUpDto: SignUpDTO): Promise<CreateUserResponse> {
    return this.userService.signUp(signUpDto);
  }

  @Post('/signin')
  signIn(@Body() signInDto: SignInDTO): Promise<LoginUserResponse> {
    return this.userService.signIn(signInDto);
  }
}
