import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post as PostEntity } from './entities/post.entity'
import { DeleteResult, UpdateResult } from 'typeorm';


@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) { }

    @Post()
    async create(@Body() createPostDto: CreatePostDto): Promise<PostEntity> {
        return this.postsService.create(createPostDto);
    }

    @Get()
    async findAll(): Promise<PostEntity[]> {
        return await this.postsService.findAll();
    }

    @Get('id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<PostEntity> {
        return await this.postsService.findOne(id);
    }

    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() updatePostDto: UpdatePostDto): Promise<UpdateResult> {
        return await this.postsService.update(id, updatePostDto);
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
        return await this.postsService.remove(id);
    }
}
