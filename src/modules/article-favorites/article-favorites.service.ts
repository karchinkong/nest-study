import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleFavorites } from '@/modules/article-favorites/entities/article-favorites.entity';
import { Article } from '@/modules/articles/entities/article.entity';

@Injectable()
export class ArticleFavoritesService {
  constructor(
    @InjectRepository(ArticleFavorites)
    private readonly favoritesRepository: Repository<ArticleFavorites>,
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  async favoriteArticle(articleId: string, userId: string) {
    await this.articleRepository.manager.transaction(async (manager) => {
      const existed = await manager.findOne(ArticleFavorites, {
        where: { articlesId: articleId, userId },
      });

      if (existed) {
        return;
      }

      const favorite = this.favoritesRepository.create({
        articlesId: articleId,
        userId,
      });
      await manager.save(favorite);
      await manager.increment(Article, { id: articleId }, 'favoriteCount', 1);
    });
  }

  async unfavoriteArticle(articleId: string, userId: string) {
    await this.articleRepository.manager.transaction(async (manager) => {
      const result = await manager.delete(ArticleFavorites, {
        articlesId: articleId,
        userId,
      });

      if (result && Number(result.affected || 0) > 0) {
        await manager.decrement(Article, { id: articleId }, 'favoriteCount', 1);
      }
    });
  }

  async findMyFavorites(userId: string) {
    return this.favoritesRepository.find({
      where: { userId },
      relations: [
        'article',
        'article.author',
        'article.category',
        'article.tags',
      ],
    });
  }
}
