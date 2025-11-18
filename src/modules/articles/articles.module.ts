import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { User } from '@/modules/users/entities';
import { Article } from '@/modules/articles/entities/article.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tags } from '@/modules/tags/entities/tags.entity';
import { ArticleLikes } from '@/modules/article-likes/entities/article-likes.entity';
import { ArticleViews } from '@/modules/article-views/entities/article-views.entity';
import { ArticleViewsService } from '@/modules/article-views/article-views.service';
import { SseService } from '@/modules/sse/sse.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article, ArticleLikes, ArticleViews, User, Tags]),
  ],
  controllers: [ArticlesController],
  providers: [ArticlesService, ArticleViewsService, SseService],
  exports: [ArticlesService],
})
export class ArticlesModule {}
