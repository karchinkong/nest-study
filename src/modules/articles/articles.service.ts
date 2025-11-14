import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Article } from '@/modules/articles/entities/article.entity';
import { CreateArticleDto } from '@/modules/articles/dto/create.dto';
import { Tags } from '@/modules/tags/entities/tags.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(Tags)
    private tagsRepository: Repository<Tags>,
  ) {}

  // 获取所有文章
  async getAllArticles() {
    return await this.articleRepository.find({
      relations: ['author', 'tags', 'category', 'likes', 'favorites'],
    });
  }

  async getArticleById(articleId: string) {
    return await this.articleRepository.findOne({
      where: {
        id: articleId,
      },
      relations: ['author', 'tags', 'category', 'likes', 'favorites'],
    });
  }

  async getArticleByAuthorId(authorId: string) {
    return await this.articleRepository.find({
      where: {
        authorId,
      },
      relations: ['author', 'tags', 'category', 'likes', 'favorites'],
    });
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
