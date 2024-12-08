import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Request } from 'express';
import { Payload } from 'src/auth/types/payload.type';

@Injectable()
export class PostsService {

  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,

    private readonly usersService: UsersService
  ) { }


  async create(createPostDto: CreatePostDto, req: Request): Promise<Post> {

    const user = req['user'];

    const { name, description } = createPostDto;
    console.log(name, description)

    const author = await this.usersService.getUserById(user.id);

    const post = this.postsRepository.create({ name, description, author });

    return await this.postsRepository.save(post);
  }


  async findAll(): Promise<Post[]> {
    return await this.postsRepository.find();
  }


  async findOne(id: number): Promise<Post> {

    const post = await this.postsRepository.findOne({
      where: { id },
      relations: {
        author: true
      }
    });

    if (!post) {
      throw new BadRequestException(`Пост с id = ${id} не найден`);
    }

    return post;
  }


  async findAllByAuthor(userId: number): Promise<Post[]> {

    const author = await this.usersService.getUserById(userId);

    return await this.postsRepository.findBy({ author });
  }


  async update(postId: number, updatePostDto: UpdatePostDto, req: Request): Promise<UpdateResult> {

    // const post = await this.findOne(postId);

    const user = await this.usersService.getUserById(req['user'].id);
    // console.log(post);

    // if (!user.isAdmin && user.id !== post.author.id) {
    //   throw new ForbiddenException();
    // }

    const { name, description } = updatePostDto;

    const author = await this.usersService.getUserById(user.id);

    return this.postsRepository.update({ id: postId }, { name, description, author });
  }


  async remove(id: number): Promise<DeleteResult> {

    const post = await this.findOne(id);

    return await this.postsRepository.delete(post);
  }
}
