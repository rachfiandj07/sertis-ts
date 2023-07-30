import { UnauthorizedException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { Test } from '@nestjs/testing';
import { Model } from 'mongoose';
import { AuthStrategy } from './auth.strategy';
import { User } from './schemas/user.schema';

describe('AuthStrategy', () => {
  let authStrategy: AuthStrategy;
  let userModel: Model<User>;

  beforeEach(async () => {
    process.env.JWT_SECRET = 'MyBeeHumanBee';
    const userModelFake: Partial<Model<User>> = {
      findById: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      imports: [PassportModule],
      providers: [
        AuthStrategy,
        {
          provide: getModelToken(User.name),
          useValue: userModelFake,
        },
      ],
    }).compile();

    authStrategy = moduleRef.get<AuthStrategy>(AuthStrategy);
    userModel = moduleRef.get<Model<User>>(getModelToken(User.name));
  });

  afterAll(() => {
    delete process.env.JWT_SECRET;
  });

  it('should be defined', () => {
    expect(authStrategy).toBeDefined();
  });

  it('should return a user if found in the userModel', async () => {
    const fakeUser = {
      _id: 'fakeId',
      username: 'testuser',
      password: 'testpass',
    };
    (userModel.findById as jest.Mock).mockResolvedValue(fakeUser);

    const payload = { id: 'fakeId' };
    const result = await authStrategy.validate(payload);

    expect(result).toEqual(fakeUser);
  });

  it('should throw UnauthorizedException if the user is not found', async () => {
    (userModel.findById as jest.Mock).mockResolvedValue(null);

    const payload = { id: 'nonExistentId' };

    await expect(authStrategy.validate(payload)).rejects.toThrowError(
      UnauthorizedException,
    );
  });
});
