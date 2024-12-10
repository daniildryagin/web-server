import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseGuards, Request as Req } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { UpdateResult } from 'typeorm';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Request } from 'express';
import { PostsGuard } from './guards/posts.guards';
import { PostDto } from './dto/post.dto';
import { FindPostsParamsDto } from './dto/find-posts-params.dto';

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
  async findAll1(
    @Query() findPostsParamsDto: FindPostsParamsDto,
  ): Promise<PostDto[]> {
    console.log(JSON.stringify(findPostsParamsDto))
    return await this.postsService.findAll(findPostsParamsDto);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseIntPipe()) id: number): Promise<PostDto> {
    return await this.postsService.findOne(id);
  }

  @UseGuards(PostsGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<UpdateResult> {
    return await this.postsService.update(id, updatePostDto);
  }

  @UseGuards(PostsGuard)
  @Delete(':id')
  async remove(@Param('id', new ParseIntPipe()) id: number): Promise<PostDto> {
    return await this.postsService.remove(id);
  }
}
