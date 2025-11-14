import { Test, TestingModule } from '@nestjs/testing';
import { ArticleLikesService } from './article-likes.service';

describe('ArticleLikesService', () => {
  let service: ArticleLikesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticleLikesService],
    }).compile();

    service = module.get<ArticleLikesService>(ArticleLikesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
