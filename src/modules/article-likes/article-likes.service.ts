import { Injectable } from '@nestjs/common';
import { ArticleLikes } from '@/modules/article-likes/entities/article-likes.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from '@/modules/articles/entities/article.entity';

/**
 * 文章点赞服务
 * 处理文章点赞相关的业务逻辑
 */
@Injectable()
export class ArticleLikesService {
  constructor(
    @InjectRepository(ArticleLikes)
    private articleLikesRepository: Repository<ArticleLikes>,
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  /**
   * 点赞文章
   * @param articleId 文章ID
   * @param userId 用户ID
   */
  async likeArticle(articleId: string, userId: string) {
    // 使用事务确保数据一致性
    await this.articleRepository.manager.transaction(async (manager) => {
      // 创建点赞记录
      const like = this.articleLikesRepository.create({
        articlesId: articleId,
        userId,
      });
      await manager.save(like);

      // 更新文章点赞计数
      await manager.increment(Article, { id: articleId }, 'likeCount', 1);
    });
  }

  /**
   * 取消点赞文章
   * @param articleId 文章ID
   * @param userId 用户ID
   */
  async unlikeArticle(articleId: string, userId: string) {
    // 使用事务确保数据一致性
    await this.articleRepository.manager.transaction(async (manager) => {
      // 删除点赞记录
      const result = await manager.delete(ArticleLikes, {
        articlesId: articleId,
        userId,
      });

      if (result && Number(result.affected || 0) > 0) {
        // 更新文章点赞计数
        await manager.decrement(Article, { id: articleId }, 'likeCount', 1);
      }
    });
  }
}
