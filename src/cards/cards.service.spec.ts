import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose, { Document, Model } from 'mongoose';
import { CardsService } from './cards.service';
import { CreateCardDTO } from './dto/createCard.dto';
import { Card, Category } from './schemas/card.schema';
import { ObjectId } from 'mongodb';
import { User } from 'src/users/schemas/user.schema';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('BookService', () => {
  let cardService: CardsService;
  let model: Model<Card>;

  const id = '64c2c16a2a06d43ed9ada952';

  const myObjectId: ObjectId = ObjectId.createFromHexString(id);

  const mockUser = {
    _id: myObjectId,
    username: 'NaufalRDJ',
    password: 'xcvg5hjbn1237',
  };

  const mockCard = {
    _id: '64c2c1802a06d43ed9ada955',
    name: 'Quantum Physics',
    status: true,
    content: 'Lorem ipsum dolor sit amet',
    category: Category.PHYSICS,
    user: myObjectId,
  };

  const mockCardCreate: (Document<unknown, Map<string, string>, Card> &
    Card & { _id: ObjectId })[] = [];

  const mockCardService = {
    find: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CardsService,
        {
          provide: getModelToken(Card.name),
          useValue: mockCardService,
        },
      ],
    }).compile();

    cardService = module.get<CardsService>(CardsService);
    model = module.get<Model<Card>>(getModelToken(Card.name));
  });

  describe('findAll', () => {
    it('should return an array of cards', async () => {
      const query = { page: '1', keyword: 'test' };

      jest.spyOn(model, 'find').mockImplementation(
        () =>
          ({
            limit: () => ({
              skip: jest.fn().mockResolvedValue([mockCard]),
            }),
          } as any),
      );

      const result = await cardService.findAll(query);

      expect(model.find).toHaveBeenCalledWith({
        title: { $regex: 'test', $options: 'i' },
      });

      expect(result).toEqual([mockCard]);
    });
  });

  describe('create', () => {
    it('should create and return a card', async () => {
      const newCard = {
        name: 'Intro to algorithm',
        status: true,
        content: 'Lorem ipsum dolor sit amet',
        category: Category.TECHNOLOGY,
        user: mockUser,
      };

      jest
        .spyOn(model, 'create')
        .mockImplementationOnce(() => Promise.resolve(mockCardCreate));

      const result = await cardService.create(
        newCard as CreateCardDTO,
        mockUser as User,
      );

      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should find and return a card by ID', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(mockCard);

      const result = await cardService.findById(mockCard._id);

      expect(model.findById).toHaveBeenCalledWith(mockCard._id);
      expect(result).toEqual(mockCard);
    });

    it('should throw BadRequestException if invalid ID is provided', async () => {
      const id = 'invalid-id';

      const isValidObjectIDMock = jest
        .spyOn(mongoose, 'isValidObjectId')
        .mockReturnValue(false);

      await expect(cardService.findById(id)).rejects.toThrow(
        BadRequestException,
      );

      expect(isValidObjectIDMock).toHaveBeenCalledWith(id);
      isValidObjectIDMock.mockRestore();
    });

    it('should throw NotFoundException if card is not found', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(null);

      await expect(cardService.findById(mockCard._id)).rejects.toThrow(
        NotFoundException,
      );

      expect(model.findById).toHaveBeenCalledWith(mockCard._id);
    });
  });

  describe('updateById', () => {
    it('should update and return a card', async () => {
      const updatedCard = { ...mockCard, name: 'Updated name' };
      const card = { name: 'Updated name' };

      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue(updatedCard);

      jest.spyOn(model, 'findById').mockResolvedValue(mockCard);

      const findId = await cardService.findById(mockCard._id);

      expect(findId.user._id).toEqual(mockUser._id);

      const result = await cardService.updateById(
        mockCard._id,
        card as any,
        mockUser,
      );

      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(mockCard._id, card, {
        new: true,
        runValidators: true,
      });

      expect(result.name).toEqual(card.name);
    });

    it('should throw BadRequestException if ID is invalid', async () => {
      const card = { name: 'Updated name' };
      const id = '64c2c1802a06d43ed9ada955';

      const isValidObjectIDMock = jest
        .spyOn(mongoose, 'isValidObjectId')
        .mockReturnValue(false);

      await expect(cardService.updateById(mockCard._id,
        card as any,
        mockUser,)).rejects.toThrow(
        BadRequestException,
      );

      expect(isValidObjectIDMock).toHaveBeenCalledWith(id);
      isValidObjectIDMock.mockRestore();
    });

    it('should throw NotFoundException if card is not found', async () => {
      const card = { name: 'Updated name' };

      jest.spyOn(model, 'findById').mockResolvedValue(null);

      await expect(cardService.updateById(mockCard._id,
        card as any,
        mockUser)).rejects.toThrow(
        NotFoundException,
      );

      expect(model.findById).toHaveBeenCalledWith(mockCard._id);
    });

    it('should throw BadRequestException if not the author of the cards', async () => {
      let mockId = '64c2c16a2a06d43ed9ada953';
      const card = { name: 'Updated name' };

      let mockObjectId: ObjectId = ObjectId.createFromHexString(mockId);

      let mockUser = {
        _id: myObjectId,
        username: 'NaufalRDJ',
        password: 'xcvg5hjbn1237'
      };
    
      let mockNewCard = {
        _id: '64c2c1802a06d43ed9ada955',
        name: 'Quantum Physics',
        status: true,
        content: 'Lorem ipsum dolor sit amet',
        category: Category.PHYSICS,
        user: mockObjectId,
      };
      
      jest.spyOn(model, 'findByIdAndDelete').mockResolvedValue(mockCard);

      jest.spyOn(model, 'findById').mockResolvedValue(mockNewCard);
      
      await cardService.findById(mockNewCard._id);

      await expect(cardService.updateById(mockCard._id,
        card as any,
        mockUser)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('deleteById', () => {
    it('should delete and return a card', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockResolvedValue(mockCard);

      jest.spyOn(model, 'findById').mockResolvedValue(mockCard);

      const findId = await cardService.findById(mockCard._id);

      expect(findId.user._id).toEqual(mockUser._id);

      const result = await cardService.deleteById(mockCard._id, mockUser);

      expect(model.findByIdAndDelete).toHaveBeenCalledWith(mockCard._id);

      expect(result).toEqual(mockCard);
    });

    it('should throw BadRequestException if ID is invalid', async () => {
      const id = 'invalid-id';

      const isValidObjectIDMock = jest
        .spyOn(mongoose, 'isValidObjectId')
        .mockReturnValue(false);

      await expect(cardService.deleteById(id, mockUser)).rejects.toThrow(
        BadRequestException,
      );

      expect(isValidObjectIDMock).toHaveBeenCalledWith(id);
      isValidObjectIDMock.mockRestore();
    });

    it('should throw NotFoundException if card is not found', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(null);

      await expect(cardService.deleteById(mockCard._id, mockUser)).rejects.toThrow(
        NotFoundException,
      );

      expect(model.findById).toHaveBeenCalledWith(mockCard._id);
    });

    it('should throw BadRequestException if not the author of the cards', async () => {
      let mockId = '64c2c16a2a06d43ed9ada953';

      let mockObjectId: ObjectId = ObjectId.createFromHexString(mockId);

      let mockUser = {
        _id: myObjectId,
        username: 'NaufalRDJ',
        password: 'xcvg5hjbn1237'
      };
    
      let mockNewCard = {
        _id: '64c2c1802a06d43ed9ada955',
        name: 'Quantum Physics',
        status: true,
        content: 'Lorem ipsum dolor sit amet',
        category: Category.PHYSICS,
        user: mockObjectId,
      };
      
      jest.spyOn(model, 'findByIdAndDelete').mockResolvedValue(mockCard);

      jest.spyOn(model, 'findById').mockResolvedValue(mockNewCard);
      
      await cardService.findById(mockNewCard._id);

      await expect(cardService.deleteById(id, mockUser)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
