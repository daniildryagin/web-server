import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseGuards, Request as Req, UseInterceptors } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { UpdateResult } from 'typeorm';
import { Request } from 'express';
import { PostsGuard } from './guards/posts.guards';
import { PostResponseDto } from './dto/post-response.dto';
import { FindPostsParamsDto } from './dto/find-posts-params.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UpdateResultDto } from '../common/dto/update-result.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать статью' })
  @ApiOkResponse({ type: PostResponseDto })
  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() createPostDto: CreatePostDto,
    @Req() req: Request
  ): Promise<PostResponseDto> {
    return await this.postsService.create(createPostDto, req);
  }

  @ApiOperation({ summary: 'Получить статьи' })
  @ApiOkResponse({ type: [PostResponseDto] })
  @Get()
  async findAll(
    @Query() findPostsParamsDto: FindPostsParamsDto,
  ): Promise<PostResponseDto[]> {
    return await this.postsService.findAll(findPostsParamsDto);
  }

  @ApiOperation({ summary: 'Получить статью' })
  @ApiParam({ name: 'id', description: 'ID статьи' })
  @ApiOkResponse({ type: PostResponseDto })
  @UseInterceptors(CacheInterceptor)
  @Get(':id')
  async findOne(@Param('id', new ParseIntPipe()) id: number): Promise<PostResponseDto> {
    return await this.postsService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Изменить статью' })
  @ApiParam({ name: 'id', description: 'ID статьи' })
  @ApiOkResponse({ type: UpdateResultDto })
  @UseGuards(AuthGuard, PostsGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<UpdateResult> {
    return await this.postsService.update(id, updatePostDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить статью' })
  @ApiParam({ name: 'id', description: 'ID статьи' })
  @ApiOkResponse({ type: PostResponseDto })
  @UseGuards(AuthGuard, PostsGuard)
  @Delete(':id')
  async remove(@Param('id', new ParseIntPipe()) id: number): Promise<PostResponseDto> {
    return await this.postsService.remove(id);
  }
}
