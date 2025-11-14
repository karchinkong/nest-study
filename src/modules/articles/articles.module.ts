import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { User } from '@/modules/users/entities';
import { Article } from '@/modules/articles/entities/article.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tags } from '@/modules/tags/entities/tags.entity';
import { ArticleLikes } from '@/modules/article-likes/entities/article-likes.entity';
import { SseService } from '@/modules/sse/sse.service';

@Module({
  imports: [TypeOrmModule.forFeature([Article, ArticleLikes, User, Tags])],
  controllers: [ArticlesController],
  providers: [ArticlesService, SseService],
  exports: [ArticlesService],
})
export class ArticlesModule {}
