import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { And, LessThan, MoreThanOrEqual, Repository, UpdateResult } from 'typeorm';
import { Article } from './entities/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
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


  async create(createArticleDto: CreateArticleDto, user: RequestUserData): Promise<ArticleResponseDto> {
    const { name, description } = createArticleDto;

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

    const articles = await this.articlesRepository.find({
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

    return articles.map(articles => this.transformArticle(articles));
  }

  async findArticleById(id: number): Promise<Article> {
    const article = await this.articlesRepository.findOne({
      where: { id },
      relations: {
        author: true
      }
    });

    if (!article) {
      throw new BadRequestException(`Пост с id=${id} не найден`);
    }

    return article;
  }

  async findOneById(id: number): Promise<ArticleResponseDto> {
    const article = await this.findArticleById(id);

    return this.transformArticle(article);
  }

  async findAllByAuthor(userId: number): Promise<ArticleResponseDto[]> {
    const author = await this.usersService.getUserById(userId);

    const articles = await this.articlesRepository.find(
      {
        where: { author },
        relations: { author: true }
      });

    return articles.map(articles => this.transformArticle(articles));
  }


  async update(articleId: number, updateArticleDto: UpdateArticleDto): Promise<ArticleResponseDto> {
    const { name, description } = updateArticleDto;

    const article = await this.findArticleById(articleId);

    await this.articlesRepository.update({ id: article.id }, { name, description });

    await this.cacheManager.del(`/articles/${articleId}`);

    return this.findOneById(articleId);
  }


  async remove(id: number): Promise<ArticleResponseDto> {
    const article = await this.findArticleById(id);

    const removedArticle = await this.articlesRepository.remove(article);

    await this.cacheManager.del(`/articles/${id}`);

    return this.transformArticle(removedArticle);
  }

  transformArticle(article: Article): ArticleResponseDto {
    const { author, ...createdArticle } = article;

    return { ...createdArticle, authorId: author.id };
  }
}
