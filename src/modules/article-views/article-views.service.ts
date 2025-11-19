import { Injectable } from '@nestjs/common';
import { ArticleViews } from '@/modules/article-views/entities/article-views.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from '@/modules/articles/entities/article.entity';

export interface DailyViewsByAuthorResult {
  date: Date;
  viewCount: string;
  articleCount: string;
  authorNickName: string;
}

export interface DailyViewsByArticleResult {
  date: Date;
  articleId: string;
  articleTitle: string;
  viewCount: string;
}

@Injectable()
export class ArticleViewsService {
  constructor(
    @InjectRepository(ArticleViews)
    private articleViewsRepository: Repository<ArticleViews>,
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  /**
   * 记录文章浏览量
   * @param articleId 文章ID
   * @param userId 用户ID（可选，未登录用户为null）
   */
  async recordView(articleId: string, userId?: string | null) {
    // 使用事务确保数据一致性
    await this.articleRepository.manager.transaction(async (manager) => {
      // 创建浏览记录
      const view = this.articleViewsRepository.create({
        articlesId: articleId,
        userId: userId || null,
      });
      await manager.save(view);

      // 更新文章浏览量计数
      await manager.increment(Article, { id: articleId }, 'viewCount', 1);
    });
  }

  /**
   * 查询作者每天的文章浏览量统计
   * @param authorId 作者ID
   * @param startDate 开始日期（可选）
   * @param endDate 结束日期（可选）
   * @returns 按日期分组的浏览量统计
   */
  async getDailyViewsByAuthor(
    authorId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<DailyViewsByAuthorResult[]> {
    const queryBuilder = this.articleViewsRepository
      .createQueryBuilder('view')
      .innerJoin('view.article', 'article')
      .innerJoin('article.author', 'author')
      .where('article.authorId = :authorId', { authorId })
      .select('DATE(view.createAt)', 'date')
      .addSelect('author.nickname', 'authorNickName')
      .addSelect('COUNT(view.id)', 'viewCount')
      .addSelect('COUNT(DISTINCT view.articlesId)', 'articleCount')
      .groupBy('DATE(view.createAt), nickname')
      .orderBy('date', 'DESC');

    if (startDate) {
      queryBuilder.andWhere('view.createAt >= :startDate', { startDate });
    }

    if (endDate) {
      // 将结束日期设置为当天的23:59:59
      const endDateTime = new Date(endDate);
      endDateTime.setHours(23, 59, 59, 999);
      queryBuilder.andWhere('view.createAt <= :endDate', {
        endDate: endDateTime,
      });
    }

    return await queryBuilder.getRawMany();
  }

  /**
   * 查询作者指定文章每天的浏览量统计
   * @param authorId 作者ID
   * @param articleId 文章ID（可选，不传则查询所有文章）
   * @param startDate 开始日期（可选）
   * @param endDate 结束日期（可选）
   * @returns 按日期和文章分组的浏览量统计
   */
  async getDailyViewsByArticle(
    authorId: string,
    articleId?: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<DailyViewsByArticleResult[]> {
    const queryBuilder = this.articleViewsRepository
      .createQueryBuilder('view')
      .innerJoin('view.article', 'article')
      .select('DATE(view.createAt)', 'date')
      .addSelect('view.articlesId', 'articleId')
      .addSelect('article.title', 'articleTitle')
      .addSelect('COUNT(view.id)', 'viewCount')
      .groupBy('DATE(view.createAt)')
      .addGroupBy('view.articlesId')
      .addGroupBy('article.title')
      .orderBy('date', 'DESC')
      .addOrderBy('COUNT(view.id)', 'DESC');

    if (authorId) {
      queryBuilder.where('article.authorId = :authorId', { authorId });
    }

    if (articleId) {
      queryBuilder.andWhere('view.articlesId = :articleId', { articleId });
    }

    if (startDate) {
      queryBuilder.andWhere('view.createAt >= :startDate', { startDate });
    }

    if (endDate) {
      // 将结束日期设置为当天的23:59:59
      const endDateTime = new Date(endDate);
      endDateTime.setHours(23, 59, 59, 999);
      queryBuilder.andWhere('view.createAt <= :endDate', {
        endDate: endDateTime,
      });
    }

    return await queryBuilder.getRawMany();
  }
}
