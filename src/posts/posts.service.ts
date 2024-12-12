import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { And, LessThan, MoreThanOrEqual, Repository, UpdateResult } from 'typeorm';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Request } from 'express';
import { PostDto } from './dto/post.dto';
import { UserDataRequest } from 'src/auth/types/user-data-request.type';
import { User } from 'src/users/entities/user.entity';
import { FindPostsParamsDto, OrderingValues, PostsOrderParamValues } from './dto/find-posts-params.dto';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PostsService {

  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService
  ) { }


  async create(createPostDto: CreatePostDto, req: Request): Promise<PostDto> {

    const { name, description } = createPostDto;

    const user: UserDataRequest = req['user'];

    const author = await this.usersService.getUserById(user.id);

    const newPost = await this.postsRepository.save({ name, description, author });

    return this.transformPost(newPost);
  }


  async findAll(searchParams: FindPostsParamsDto): Promise<PostDto[]> {

    const {
      take = 10,
      skip = 0,
      order = PostsOrderParamValues.publicationDate,
      ordering = OrderingValues.asc,
      publicationDateFrom = new Date(0),
      publicationDateTo = new Date(Date.now()),
      authorId
    } = searchParams;

    let author: User;

    if (authorId) {
      author = await this.usersService.getUserById(authorId);
    }

    const posts = await this.postsRepository.find({
      where: {
        author,
        publicationDate: And(MoreThanOrEqual(publicationDateFrom), LessThan(publicationDateTo))
      },
      order: { [order]: ordering },
      relations: {
        author: true
      },
      take,
      skip
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

    if (!post) {
      throw new BadRequestException(`Пост с id=${id} не найден`);
    }

    return post;
  }

  async findOne(id: number): Promise<PostDto> {
    const post = await this.findPostById(id);

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

    const post = await this.findPostById(postId);

    const updateResult = await this.postsRepository.update({ id: post.id }, { name, description });

    await this.cacheManager.del(`/posts/${postId}`);

    if (updateResult.affected > 0) {
      this.cacheManager.del(postId + '');
    }

    return updateResult;
  }


  async remove(id: number): Promise<PostDto> {

    const post = await this.findPostById(id);

    const removedPost = await this.postsRepository.remove(post);

    await this.cacheManager.del(`/posts/${id}`);

    return this.transformPost(removedPost);
  }

  transformPost(post: Post): PostDto {
    const { author, ...createdPost } = post;

    return { ...createdPost, authorId: author.id };
  }
}
