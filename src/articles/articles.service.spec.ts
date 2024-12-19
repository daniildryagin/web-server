import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesService } from './articles.service';
import { Article } from './entities/article.entity';
import { User } from '../users/entities/user.entity';
import { ArticlesOrderParamValues } from './dto/find-articles-params.dto';
import { CreateArticleDto } from './dto/create-article.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { UsersService } from '../users/users.service';
import { ArticleResponseDto } from './dto/article-response.dto';
import { BadRequestException } from '@nestjs/common';
import { UpdateArticleDto } from './dto/update-article.dto';

describe('ArticlesService', () => {
  let service: ArticlesService;

  const userMock: User = {
    id: 1,
    email: 'foo@test.com',
    password: 'qwertyuiop',
    isAdmin: false,
    articles: []
  };

  const articleMock: Article = {
    id: Date.now(),
    name: 'Topic',
    description: 'Description of the topic',
    publicationDate: new Date(0),
    author: userMock
  };

  const articleResponseDtoMock: ArticleResponseDto = {
    id: articleMock.id,
    name: articleMock.name,
    description: articleMock.description,
    authorId: userMock.id,
    publicationDate: articleMock.publicationDate
  };

  const searchParamsMock = {
    take: 1,
    skip: 0,
    order: ArticlesOrderParamValues.PublicationDate
  };


  // const articleListMock: Article[] = [
  //   articleMock,
  //   {
  //     id: 2,
  //     name: 'Dog',
  //     description: 'Labrador',
  //     author: userMock,
  //     publicationDate: new Date(0)
  //   }
  // ]

  const articlesRepositoryMock = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
    remove: jest.fn()
  };

  const usersRepositoryMock = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
    remove: jest.fn()
  };

  const cacheMock = {
    del: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        UsersService,
        {
          provide: getRepositoryToken(Article),
          useValue: articlesRepositoryMock
        },
        {
          provide: getRepositoryToken(User),
          useValue: usersRepositoryMock
        },
        {
          provide: CACHE_MANAGER,
          useValue: cacheMock
        },
      ],

    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
  });

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create new article', async () => {
      const createArticleDtoMock: CreateArticleDto = {
        name: 'Cat',
        description: 'Description of my cat'
      };

      const createdArticleMock: Article = {
        ...articleMock,
        name: createArticleDtoMock.name,
        description: createArticleDtoMock.description,
      };

      const articleResponseDtoMock: ArticleResponseDto = {
        id: createdArticleMock.id,
        name: createArticleDtoMock.name,
        description: createArticleDtoMock.description,
        authorId: createdArticleMock.author.id,
        publicationDate: createdArticleMock.publicationDate
      };

      const userDataMock = { id: userMock.id, email: userMock.email };

      articlesRepositoryMock.save = jest.fn().mockResolvedValueOnce(createdArticleMock);
      usersRepositoryMock.findOneBy = jest.fn().mockResolvedValueOnce(userMock);

      const saveMethod = articlesRepositoryMock.save;

      expect(await service.create(createArticleDtoMock, userDataMock)).toEqual(articleResponseDtoMock);
      expect(saveMethod).toHaveBeenCalledWith({ ...createArticleDtoMock, author: userMock });
    })
  })

  describe('findOneById', () => {
    it('should find article by id', async () => {
      articlesRepositoryMock.findOne = jest.fn().mockResolvedValue(articleMock);

      expect(await service.findOneById(articleMock.id)).toEqual(articleResponseDtoMock);
      expect(articlesRepositoryMock.findOne).toHaveBeenLastCalledWith({
        where: { id: articleResponseDtoMock.id },
        relations: {
          author: true
        }
      });
    });

    it('should throw BadRequestException if article was not found', async () => {
      articlesRepositoryMock.findOne = jest.fn();

      await expect(service.findOneById(2)).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    const updateArticleDtoMock: UpdateArticleDto = {
      name: 'New Topic',
      description: 'Updated Description'
    };

    const updatedArticleMock: Article = {
      ...articleMock,
      name: updateArticleDtoMock.name,
      description: updateArticleDtoMock.description,
    };

    const articleResponseDtoMock: ArticleResponseDto = {
      id: updatedArticleMock.id,
      name: updateArticleDtoMock.name,
      description: updateArticleDtoMock.description,
      publicationDate: updatedArticleMock.publicationDate,
      authorId: updatedArticleMock.author.id
    };

    it('should update the article with given data', async () => {
      articlesRepositoryMock.findOne = jest.fn().mockResolvedValue(updatedArticleMock);

      expect(await service.update(articleResponseDtoMock.id, updateArticleDtoMock)).toEqual(articleResponseDtoMock);
      expect(articlesRepositoryMock.update).toHaveBeenCalledWith(
        { id: articleResponseDtoMock.id },
        { ...updateArticleDtoMock }
      );
    });
  });

  describe('delete', () => {
    it('delete article by the given id', async () => {

      const removedArticleDto = articleResponseDtoMock;

      articlesRepositoryMock.findOne = jest.fn().mockResolvedValue(articleMock);
      articlesRepositoryMock.remove = jest.fn().mockResolvedValue(articleMock);

      expect(await service.remove(articleMock.id)).toEqual(removedArticleDto);
      expect(articlesRepositoryMock.remove).toHaveBeenCalledWith(articleMock);
    });
  });
});
