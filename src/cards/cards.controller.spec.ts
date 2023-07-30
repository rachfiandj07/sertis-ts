import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../users/schemas/user.schema';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { CreateCardDTO } from './dto/createCard.dto';
import { Category } from './schemas/card.schema';
import { UpdateCardDTO } from './dto/updateCard.dto';
import { ObjectId } from 'mongodb';

describe('CardsController', () => {
  let cardService: CardsService;
  let cardController: CardsController;

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
    user: '64c2c16a2a06d43ed9ada952',
  };

  const mockCardService = {
    findAll: jest.fn().mockResolvedValueOnce([mockCard]),
    create: jest.fn(),
    findById: jest.fn().mockResolvedValueOnce(mockCard),
    updateById: jest.fn(),
    deleteById: jest.fn().mockResolvedValueOnce({ deleted: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [CardsController],
      providers: [
        {
          provide: CardsService,
          useValue: mockCardService,
        },
      ],
    }).compile();

    cardService = module.get<CardsService>(CardsService);
    cardController = module.get<CardsController>(CardsController);
  });

  it('should be defined', () => {
    expect(cardController).toBeDefined();
  });

  describe('getAllCards', () => {
    it('should get all cards', async () => {
      const result = await cardController.getAllCards({
        page: '1',
        keyword: 'test',
      });

      expect(cardService.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockCard]);
    });
  });

  describe('createBook', () => {
    it('should create a new book', async () => {
      const newCard = {
        name: 'Intro Algorithm',
        status: true,
        content: 'Lorem ipsum dolor sit amet',
        category: Category.TECHNOLOGY,
      };

      mockCardService.create = jest.fn().mockResolvedValueOnce(mockCard);

      const result = await cardController.createCard(
        newCard as CreateCardDTO,
        mockUser as User,
      );

      expect(cardService.create).toHaveBeenCalled();
      expect(result).toEqual(mockCard);
    });
  });

  describe('getCardById', () => {
    it('should get a card by ID', async () => {
      const result = await cardController.getCard(mockCard._id);

      expect(cardService.findById).toHaveBeenCalled();
      expect(result).toEqual(mockCard);
    });
  });

  describe('updateCard', () => {
    it('should update card by its ID', async () => {
      const updatedCard = { ...mockCard, name: 'Updated name' };
      const card = { name: 'Updated name' };
      const req = '64c2c1802a06d43ed9ada955';

      mockCardService.updateById = jest.fn().mockResolvedValueOnce(updatedCard);

      const result = await cardController.updateCard(
        mockCard._id,
        card as UpdateCardDTO,
        req,
      );

      expect(cardService.updateById).toHaveBeenCalled();
      expect(result).toEqual(updatedCard);
    });
  });

  describe('deleteCard', () => {
    it('should delete a card by ID', async () => {
      const req = '64c2c1802a06d43ed9ada955';
      const result = await cardController.deleteCard(mockCard._id, req);

      expect(cardService.deleteById).toHaveBeenCalled();
      expect(result).toEqual({ deleted: true });
    });
  });
});
