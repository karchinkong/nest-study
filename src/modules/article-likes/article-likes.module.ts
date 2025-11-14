import { Module } from '@nestjs/common';
import { ArticleLikesController } from './article-likes.controller';
import { ArticleLikesService } from './article-likes.service';
import { ArticleLikes } from './entities/article-likes.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from '@/modules/articles/entities/article.entity';
import { User } from '@/modules/users/entities';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleLikes, Article, User])],
  controllers: [ArticleLikesController],
  providers: [ArticleLikesService]
})
export class ArticleLikesModule {}
