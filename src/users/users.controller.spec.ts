import { Test, TestingModule } from '@nestjs/testing';
import { SignInDTO } from './dto/signIn.dto';
import { SignUpDTO } from './dto/signUp.dto';
import { CreateUserResponse, LoginUserResponse } from './interface/User';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let userController: UsersController;
  let userService: UsersService;

  const createUserResponse: CreateUserResponse = {
    password: 'eyJhbGciOiJIUzI1NiIsInR',
    token: 'kb1kigl4',
  };

  const loginUserResponse: LoginUserResponse = {
    token: 'kb1jigl4',
  };

  const mockAuthService = {
    signUp: jest.fn().mockResolvedValueOnce(createUserResponse),
    signIn: jest.fn().mockResolvedValueOnce(loginUserResponse),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    userController = module.get<UsersController>(UsersController);
    userService = module.get<UsersService>(UsersService);
  });

  describe('signUp', () => {
    it('should register a new user', async () => {
      const signUpDto: SignUpDTO = {
        username: 'NaufalRDJ',
      };

      const result = await userController.signUp(signUpDto);
      expect(userService.signUp).toHaveBeenCalled();
      expect(result).toEqual(createUserResponse);
    });
  });

  describe('signIn', () => {
    it('should login a user', async () => {
      const signInDto: SignInDTO = {
        username: 'NaufalRDJ',
        password: 'zxcvyben456',
      };

      const result = await userController.signIn(signInDto);
      expect(userService.signIn).toHaveBeenCalled();
      expect(result).toEqual(loginUserResponse);
    });
  });
});
