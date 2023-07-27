import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Query } from 'express-serve-static-core';
import { User } from 'src/users/schemas/user.schema';
import { Card } from './schemas/card.schema';

@Injectable()
export class CardsService {
  constructor(
    @InjectModel(Card.name)
    private cardModel: mongoose.Model<Card>,
  ) {}

  async findAll(query: Query): Promise<Card[]> {
    const resPerPage = 2;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    const keyword = query.keyword
      ? {
          title: {
            $regex: query.keyword,
            $options: 'i',
          },
        }
      : {};

    const cards = await this.cardModel
      .find({ ...keyword })
      .limit(resPerPage)
      .skip(skip);
    return cards;
  }

  async create(card: Card, user: User): Promise<Card> {
    const data = Object.assign(card, { user: user._id });
    const res = await this.cardModel.create(data);
    return res;
  }

  async findById(id: string): Promise<Card> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Please enter correct id.');
    }

    const card = await this.cardModel.findById(id);

    if (!card) {
      throw new NotFoundException('Card not found.');
    }

    return card;
  }

  async updateById(id: string, card: Card, user: User): Promise<Card> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Please enter correct id.');
    }

    const findExistingCard = await this.cardModel.findById(id);

    if (!findExistingCard) {
      throw new NotFoundException('Card not found.');
    }

    if (!findExistingCard.user._id.equals(user._id)) {
      throw new BadRequestException('You are not the author of the cards');
    }

    return await this.cardModel.findByIdAndUpdate(id, card, {
      new: true,
      runValidators: true,
    });
  }

  async deleteById(id: string, user: User): Promise<Card> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Please enter correct id.');
    }

    const findExistingCard = await this.cardModel.findById(id);

    if (!findExistingCard) {
      throw new NotFoundException('Card not found.');
    }

    if (!findExistingCard.user._id.equals(user._id)) {
      throw new BadRequestException('You are not the author of the cards');
    }

    return await this.cardModel.findByIdAndDelete(id);
  }
}
