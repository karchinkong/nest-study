import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleFavorites } from '@/modules/article-favorites/entities/article-favorites.entity';
import { Article } from '@/modules/articles/entities/article.entity';
import { User } from '@/modules/users/entities';
import { ArticleFavoritesController } from '@/modules/article-favorites/article-favorites.controller';
import { ArticleFavoritesService } from '@/modules/article-favorites/article-favorites.service';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleFavorites, Article, User])],
  controllers: [ArticleFavoritesController],
  providers: [ArticleFavoritesService],
})
export class ArticleFavoritesModule {}
