import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseGuards, Request as Req } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post as PostEntity } from './entities/post.entity'
import { DeleteResult, UpdateResult } from 'typeorm';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Request } from 'express';
import { json } from 'stream/consumers';
import { PostsGuard } from './guards/posts.guards';
import { PostDto } from './dto/post.dto';

@UseGuards(AuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @Post()
  async create(
    @Body() createPostDto: CreatePostDto,
    @Req() req: Request
  ): Promise<PostDto> {
    return await this.postsService.create(createPostDto, req);
  }

  @Get()
  async findAll(): Promise<PostDto[]> {
    return await this.postsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<PostDto> {
    return await this.postsService.findOne(id);
  }

  @UseGuards(PostsGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: Request
  ): Promise<UpdateResult> {
    return await this.postsService.update(id, updatePostDto);
  }

  @UseGuards(PostsGuard)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<PostDto> {
    return await this.postsService.remove(id);
  }
}
