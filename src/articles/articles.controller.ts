import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseGuards, Request as Req, UseInterceptors } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { UpdateResult } from 'typeorm';
import { Request } from 'express';
import { ArticlesGuard } from './guards/article.guards';
import { ArticleResponseDto } from './dto/article-response.dto';
import { FindArticlesParamsDto } from './dto/find-articles-params.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UpdateResultDto } from '../common/dto/update-result.dto';
import { ArticlesService } from './articles.service';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) { }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать статью' })
  @ApiOkResponse({ type: ArticleResponseDto })
  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() createArticleDto: CreateArticleDto,
    @Req() req: Request
  ): Promise<ArticleResponseDto> {
    return await this.articlesService.create(createArticleDto, req);
  }

  @ApiOperation({ summary: 'Получить статьи' })
  @ApiOkResponse({ type: [ArticleResponseDto] })
  @Get()
  async findAll(
    @Query() findArticlesParamsDto: FindArticlesParamsDto,
  ): Promise<ArticleResponseDto[]> {
    return await this.articlesService.findAll(findArticlesParamsDto);
  }

  @ApiOperation({ summary: 'Получить статью' })
  @ApiParam({ name: 'id', description: 'ID статьи' })
  @ApiOkResponse({ type: ArticleResponseDto })
  @UseInterceptors(CacheInterceptor)
  @Get(':id')
  async findOne(@Param('id', new ParseIntPipe()) id: number): Promise<ArticleResponseDto> {
    return await this.articlesService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Изменить статью' })
  @ApiParam({ name: 'id', description: 'ID статьи' })
  @ApiOkResponse({ type: UpdateResultDto })
  @UseGuards(AuthGuard, ArticlesGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateArticleDto: UpdateArticleDto,
  ): Promise<UpdateResult> {
    return await this.articlesService.update(id, updateArticleDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить статью' })
  @ApiParam({ name: 'id', description: 'ID статьи' })
  @ApiOkResponse({ type: ArticleResponseDto })
  @UseGuards(AuthGuard, ArticlesGuard)
  @Delete(':id')
  async remove(@Param('id', new ParseIntPipe()) id: number): Promise<ArticleResponseDto> {
    return await this.articlesService.remove(id);
  }
}
