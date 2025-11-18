import { Module } from '@nestjs/common';
import { ArticleViewsController } from './article-views.controller';
import { ArticleViewsService } from './article-views.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleViews } from './entities/article-views.entity';
import { Article } from '@/modules/articles/entities/article.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleViews, Article])],
  controllers: [ArticleViewsController],
  providers: [ArticleViewsService],
  exports: [ArticleViewsService],
})
export class ArticleViewsModule {}
