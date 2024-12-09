import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Request } from 'express';
import { PostDto } from './dto/post.dto';
import { UserDataRequest } from 'src/auth/types/user-data-request.type';

@Injectable()
export class PostsService {

  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    private readonly usersService: UsersService
  ) { }


  async create(createPostDto: CreatePostDto, req: Request): Promise<PostDto> {

    const { name, description } = createPostDto;

    const user: UserDataRequest = req['user'];

    const author = await this.usersService.getUserById(user.id);

    const newPost = await this.postsRepository.save({ name, description, author });

    return this.transformPost(newPost);
  }


  async findAll(): Promise<PostDto[]> {
    const posts = await this.postsRepository.find({
      relations: {
        author: true
      }
    });

    return posts.map(post => this.transformPost(post));
  }

  async findPostById(id: number): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: {
        author: true
      }
    });

    return post;
  }

  async findOne(id: number): Promise<PostDto> {

    const post = await this.postsRepository.findOne({
      where: { id },
      relations: {
        author: true
      }
    });

    if (!post) {
      throw new BadRequestException(`Пост с id=${id} не найден`);
    }

    return this.transformPost(post);
  }


  async findAllByAuthor(userId: number): Promise<PostDto[]> {

    const author = await this.usersService.getUserById(userId);

    const posts = await this.postsRepository.find(
      {
        where: { author },
        relations: { author: true }
      });

    return posts.map(post => this.transformPost(post));
  }


  async update(postId: number, updatePostDto: UpdatePostDto): Promise<UpdateResult> {

    const { name, description } = updatePostDto;

    const post = await this.findOne(postId);

    return this.postsRepository.update({ id: post.id }, { name, description });
  }


  async remove(id: number): Promise<PostDto> {

    const post = await this.findPostById(id);

    const removedPost = await this.postsRepository.remove(post);

    return this.transformPost(removedPost);
  }

  transformPost(post: Post): PostDto {
    const { author, ...createdPost } = post;

    return { ...createdPost, authorId: author.id };
  }
}
