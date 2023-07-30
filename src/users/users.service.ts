import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignUpDTO } from 'src/users/dto/signUp.dto';
import { SignInDTO } from './dto/signIn.dto';
import { CreateUserResponse, LoginUserResponse } from './interface/User';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDTO: SignUpDTO): Promise<CreateUserResponse> {
    const { username } = signUpDTO;

    // Generate random, ie : 0.123456
    // Convert to base36, ie : "0.4fzyo82mvyr"
    // Cut off last 8 characters, ie : "yo82mvyr"
    const randomGeneratedPassowrd: string = Math.random()
      .toString(36)
      .slice(-8);

    const hashedPassword = await bcrypt.hash(randomGeneratedPassowrd, 10);

    const user = await this.userModel.create({
      username,
      password: hashedPassword,
    });

    const token = this.jwtService.sign({
      id: user._id,
    });

    const createUserResponse: CreateUserResponse = {
      password: randomGeneratedPassowrd,
      token: token,
    };

    return createUserResponse;
  }

  async signIn(signInDto: SignInDTO): Promise<LoginUserResponse> {
    const { username, password } = signInDto;

    const user = await this.userModel.findOne({ username });

    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.jwtService.sign({ id: user._id });

    const loginUserResponse: LoginUserResponse = {
      token: token,
    };

    return loginUserResponse;
  }
}
