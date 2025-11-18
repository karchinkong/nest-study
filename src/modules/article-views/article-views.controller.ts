import { Controller, Get, Query } from '@nestjs/common';
import { ArticleViewsService } from './article-views.service';
import { GetUser } from '@/common/decorators/get-user.decorator';
import { User } from '@/modules/users/entities';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';

@Controller('article-views')
export class ArticleViewsController {
  constructor(private readonly articleViewsService: ArticleViewsService) {}

  @ApiOperation({
    summary: '查询作者每天的文章浏览量统计',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: '开始日期 (YYYY-MM-DD)',
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: '结束日期 (YYYY-MM-DD)',
    example: '2024-12-31',
  })
  @Get('daily-stats')
  async getDailyStats(
    @GetUser() user: User,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.articleViewsService.getDailyViewsByAuthor(user.id, start, end);
  }

  @ApiOperation({
    summary: '查询作者指定文章每天的浏览量统计',
  })
  @ApiQuery({
    name: 'articleId',
    required: false,
    description: '文章ID（不传则查询所有文章）',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: '开始日期 (YYYY-MM-DD)',
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: '结束日期 (YYYY-MM-DD)',
    example: '2024-12-31',
  })
  @Get('daily-article-stats')
  async getDailyArticleStats(
    @GetUser() user: User,
    @Query('articleId') articleId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.articleViewsService.getDailyViewsByArticle(
      user.id,
      articleId,
      start,
      end,
    );
  }
}
