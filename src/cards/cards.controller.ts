import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { AuthGuard } from '@nestjs/passport';
import { CardsService } from './cards.service';
import { Card } from './schemas/card.schema';
import { CreateCardDTO } from './dto/createCard.dto';
import { UpdateCardDTO } from './dto/updateCard.dto';
import { RequestContext } from 'src/users/context/context';

@Controller('cards')
export class CardsController {
  constructor(private cardService: CardsService) {}

  @Get()
  @UseGuards(AuthGuard())
  async getAllBooks(@Query() query: ExpressQuery): Promise<Card[]> {
    return this.cardService.findAll(query);
  }

  @Post()
  @UseGuards(AuthGuard())
  async createBook(
    @Body()
    card: CreateCardDTO,
    @RequestContext() requestContext,
  ): Promise<Card> {
    const req = requestContext.user;
    return this.cardService.create(card, req);
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  async getBook(
    @Param('id')
    id: string,
  ): Promise<Card> {
    return this.cardService.findById(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard())
  async updateBook(
    @Param('id')
    id: string,
    @Body()
    card: UpdateCardDTO,
    @RequestContext() requestContext,
  ): Promise<Card> {
    const req = requestContext.user;
    return this.cardService.updateById(id, card, req);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  async deleteBook(
    @Param('id')
    id: string,
    @RequestContext() requestContext,
  ): Promise<Card> {
    const req = requestContext.user;
    return this.cardService.deleteById(id, req);
  }
}