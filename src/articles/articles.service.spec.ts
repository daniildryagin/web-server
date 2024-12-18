import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesService } from './articles.service';
import { Article } from './entities/article.entity';
import { User } from '../users/entities/user.entity';
import { ArticlesOrderParamValues } from './dto/find-articles-params.dto';
import { CreateArticleDto } from './dto/create-article.dto';

describe('ArticlesService', () => {
  let service: ArticlesService;

  const searchParamsMock = {
    take: 1,
    skip: 0,
    order: ArticlesOrderParamValues.PublicationDate
  };



  const postDtoMock: CreateArticleDto = {
    name: 'Test',
    description: 'Description test'
  };

  // const user: User = {
  //   id: 1,
  //   email: 'cat@test.com',
  //   password: '11mdmcd'
  // }

  // const postMock: Post = {
  //   id: 1,
  //   name: 'Test',
  //   description: 'Description test',
  //   author: 
  // };

  const postListMock = []

  const postsRepositoryMock = {
    save: jest.fn().mockImplementation((postDto) => ({ id: expect.any(Number), ...postDto })),
    find: jest.fn().mockImplementation((findManyOptions) => ({}))
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticlesService],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
