import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { And, LessThan, MoreThanOrEqual, Repository, UpdateResult } from 'typeorm';
import { Article } from './entities/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { ArticleResponseDto } from './dto/article-response.dto';
import { FindArticlesParamsDto } from './dto/find-articles-params.dto';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { UsersService } from '../users/users.service';
import { RequestUserData } from '../auth/types/request-user-data.type';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ArticlesService {

  constructor(
    @InjectRepository(Article)
    private readonly articlesRepository: Repository<Article>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly usersService: UsersService,
  ) { }


  async create(createArticleDto: CreateArticleDto, req: Request): Promise<ArticleResponseDto> {

    const { name, description } = createArticleDto;

    const user: RequestUserData = req['user'];

    const author = await this.usersService.getUserById(user.id);

    const newArticle = await this.articlesRepository.save({ name, description, author });

    return this.transformArticle(newArticle);
  }


  async findAll(searchParams: FindArticlesParamsDto): Promise<ArticleResponseDto[]> {

    const { take, skip, order, ordering,
      publicationDateFrom, publicationDateTo,
      authorId } = searchParams;

    let author: User;

    if (authorId) {
      author = await this.usersService.getUserById(authorId);
    }

    const articless = await this.articlesRepository.find({
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

    return articless.map(articles => this.transformArticle(articles));
  }

  async findArticleById(id: number): Promise<Article> {

    const articles = await this.articlesRepository.findOne({
      where: { id },
      relations: {
        author: true
      }
    });

    if (!articles) {
      throw new BadRequestException(`Пост с id=${id} не найден`);
    }

    return articles;
  }

  async findOne(id: number): Promise<ArticleResponseDto> {
    const articles = await this.findArticleById(id);

    return this.transformArticle(articles);
  }

  async findAllByAuthor(userId: number): Promise<ArticleResponseDto[]> {

    const author = await this.usersService.getUserById(userId);

    const articless = await this.articlesRepository.find(
      {
        where: { author },
        relations: { author: true }
      });

    return articless.map(articles => this.transformArticle(articles));
  }


  async update(articlesId: number, updateArticleDto: UpdateArticleDto): Promise<UpdateResult> {

    const { name, description } = updateArticleDto;

    const articles = await this.findArticleById(articlesId);

    const updateResult = await this.articlesRepository.update({ id: articles.id }, { name, description });

    await this.cacheManager.del(`/articless/${articlesId}`);

    if (updateResult.affected > 0) {
      this.cacheManager.del(articlesId + '');
    }

    return updateResult;
  }


  async remove(id: number): Promise<ArticleResponseDto> {

    const articles = await this.findArticleById(id);

    const removedArticle = await this.articlesRepository.remove(articles);

    await this.cacheManager.del(`/articless/${id}`);

    return this.transformArticle(removedArticle);
  }

  transformArticle(articles: Article): ArticleResponseDto {
    const { author, ...createdArticle } = articles;

    return { ...createdArticle, authorId: author.id };
  }
}
