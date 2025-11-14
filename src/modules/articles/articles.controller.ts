import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ArticlesService } from '@/modules/articles/articles.service';
import { GetUser } from '@/common/decorators/get-user.decorator';
import { User } from '@/modules/users/entities';
import { CreateArticleDto } from '@/modules/articles/dto/create.dto';
import { SseService } from '@/modules/sse/sse.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('articles')
export class ArticlesController {

  constructor(
    private readonly articlesService: ArticlesService,
    private readonly sseService: SseService,
  ) {}

  @ApiOperation({
    summary: '获取所有文章'
  })
  @Get()
  getAllArticles() {
    return this.articlesService.getAllArticles();
  }

  @ApiOperation({
    summary: '获取某个文章'
  })
  @Get('/:articleId')
  getArticleById(@Param('articleId') articleId: string) {
    return this.articlesService.getArticleById(articleId);
  }

  @ApiOperation({
    summary: '获取某个作者的所有文章'
  })
  @Get('/author/:userId')
  getArticleByAuthor(@Param('userId') userId: string) {
    return this.articlesService.getArticleByAuthorId(userId);
  }

  @ApiOperation({
    summary: '创建文章'
  })
  @Post('/create')
  async createArticle(@GetUser() user: User, @Body() createArticleDto: CreateArticleDto) {
    await this.articlesService.createArticle(user.id, createArticleDto);
    this.sseService.emit('broadcaster', { message: `${user.nickname}发布了新文章${createArticleDto.title}!` });
    return 'success';
  }

  @ApiOperation({
    summary: '删除文章'
  })
  @Delete(':articleId')
  deleteArticle(@Param('articleId') articleId: string) {
    return this.articlesService.removeArticle(articleId);
  }

}
