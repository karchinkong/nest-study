import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Article } from '@/modules/articles/entities/article.entity';
import { CreateArticleDto } from '@/modules/articles/dto/create.dto';
import { Tags } from '@/modules/tags/entities/tags.entity';
import { ArticleViewsService } from '@/modules/article-views/article-views.service';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(Tags)
    private tagsRepository: Repository<Tags>,
    private articleViewsService: ArticleViewsService,
  ) {}

  // 获取所有文章（支持分页）
  async getAllArticles(page: number = 1, pageSize: number = 10) {
    const skip = (page - 1) * pageSize;

    const [articles, total] = await this.articleRepository.findAndCount({
      relations: ['author', 'tags', 'category', 'likes', 'favorites'],
      skip,
      take: pageSize,
      order: {
        createAt: 'DESC',
      },
    });

    return {
      data: articles,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async getArticleById(articleId: string, userId?: string | null) {
    // 记录浏览量（异步执行，不阻塞返回）
    this.articleViewsService.recordView(articleId, userId).catch((err) => {
      console.error('记录浏览量失败:', err);
    });

    return await this.articleRepository.findOne({
      where: {
        id: articleId,
      },
      relations: ['author', 'tags', 'category', 'likes', 'favorites'],
    });
  }

  async getArticleByAuthorId(
    authorId: string,
    page: number = 1,
    pageSize: number = 10,
  ) {
    const skip = (page - 1) * pageSize;

    const [articles, total] = await this.articleRepository.findAndCount({
      where: {
        authorId,
      },
      take: pageSize,
      skip,
      relations: ['author', 'tags', 'category', 'likes', 'favorites'],
    });

    return {
      data: articles,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  // 发表文章
  async createArticle(authorId: string, createArticleDto: CreateArticleDto) {
    let tags: Tags[] = [];

    if (createArticleDto?.tagIds?.length) {
      tags = await this.tagsRepository.find({
        where: {
          id: In(createArticleDto.tagIds),
        },
      });
    }

    const article = this.articleRepository.create({
      authorId,
      content: createArticleDto.content,
      tags,
      title: createArticleDto.title,
      categoryId: createArticleDto.categoryId,
    });

    return await this.articleRepository.save(article);
  }

  // 删除文章
  async removeArticle(id: string) {
    return this.articleRepository.delete(id);
  }

  // 更新文章
  async updateArticle() {}
}
