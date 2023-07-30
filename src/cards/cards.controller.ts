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
import { CreateCardDTO } from './dto/createCard.dto';
import { UpdateCardDTO } from './dto/updateCard.dto';
import { RequestContext } from 'src/users/context/context';
import { CardResponse } from './interfaces/card';

@Controller('cards')
export class CardsController {
  constructor(private cardService: CardsService) {}

  @Get()
  @UseGuards(AuthGuard())
  async getAllBooks(@Query() query: ExpressQuery): Promise<CardResponse[]> {
    return this.cardService.findAll(query);
  }

  @Post()
  @UseGuards(AuthGuard())
  async createCard(
    @Body()
    card: CreateCardDTO,
    @RequestContext() requestContext,
  ): Promise<CardResponse> {
    const req = requestContext.user;
    return this.cardService.create(card, req);
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  async getCard(
    @Param('id')
    id: string,
  ): Promise<CardResponse> {
    return this.cardService.findById(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard())
  async updateCard(
    @Param('id')
    id: string,
    @Body()
    card: UpdateCardDTO,
    @RequestContext() requestContext,
  ): Promise<CardResponse> {
    const req = requestContext.user;
    return this.cardService.updateById(id, card, req);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  async deleteCard(
    @Param('id')
    id: string,
    @RequestContext() requestContext,
  ): Promise<CardResponse> {
    const req = requestContext.user;
    return this.cardService.deleteById(id, req);
  }
}
