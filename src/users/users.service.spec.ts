import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Document, Model } from 'mongoose';
import { SignUpDTO } from './dto/signUp.dto';
import { User } from './schemas/user.schema';
import { UsersService } from './users.service';
import * as bcrypt from 'bcryptjs';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { CreateUserResponse, LoginUserResponse } from './interface/User';

describe('UserService', () => {
  let userService: UsersService;
  let model: Model<User>;
  let jwtService: JwtService;

  const mockUser = {
    _id: '61c0ccf11d7bf83d153d7c06',
    username: 'NaufalRDJ',
  };

  const mockUserCreate: (Document<unknown, Map<string, string>, User> &
    User &
    Required<Map<string, string>>)[] = [];

  const createUserResponse: CreateUserResponse = {
    password: 'yo82mvyq',
    token: 'jwtToken',
  };

  const loginUserResponse: LoginUserResponse = {
    token: 'kb1jigl4',
  };

  const token = 'kb1jigl4';

  const mockUserService = {
    create: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        JwtService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserService,
        },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    model = module.get<Model<User>>(getModelToken(User.name));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('signUp', () => {
    const signUpDto: SignUpDTO = {
      username: 'NaufalRDJ',
    };

    it('should register new user', async () => {
      jest.spyOn(global.Math, 'random').mockReturnValue(0.123456);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
      jest
        .spyOn(model, 'create')
        .mockImplementationOnce(() => Promise.resolve(mockUserCreate));
      jest.spyOn(jwtService, 'sign').mockReturnValue('jwtToken');

      const result = await userService.signUp(signUpDto);

      expect(bcrypt.hash).toHaveBeenCalled();
      expect(result).toEqual(createUserResponse);
    });

    it('should throw duplicate username entered', async () => {
      jest
        .spyOn(model, 'create')
        .mockImplementationOnce(() => Promise.reject({ code: 11000 }));

      await expect(userService.signUp(signUpDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('signIn', () => {
    const loginDto = {
      username: 'NaufalRDJ',
      password: '12345678',
    };

    it('should login user and return the token', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValueOnce(mockUser);

      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);
      jest.spyOn(jwtService, 'sign').mockReturnValue(token);

      const result = await userService.signIn(loginDto);

      expect(result).toEqual(loginUserResponse);
    });

    it('should throw invalid email error', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValueOnce(null);

      expect(userService.signIn(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw invalid password error', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValueOnce(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false);

      expect(userService.signIn(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
