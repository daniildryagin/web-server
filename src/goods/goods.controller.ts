import { Controller, Get } from '@nestjs/common';
import { request } from 'express';
import { GoodsService } from './goods.service';

@Controller('')
export class GoodsController {
  constructor(private readonly goodsService: GoodsService) {}

  @Get()
  sayHi(): string {
    return this.goodsService.sayHi();
  }
}
