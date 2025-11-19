import { Controller, Param, Post } from '@nestjs/common';
import { User } from '@/modules/users/entities';
import { GetUser } from '@/common/decorators/get-user.decorator';
import { ArticleLikesService } from '@/modules/article-likes/article-likes.service';
import { ApiOperation } from '@nestjs/swagger';

/**
 * 文章点赞控制器
 * 处理文章点赞相关的HTTP请求
 */
@Controller('article-likes')
export class ArticleLikesController {
  constructor(private readonly articleLikesService: ArticleLikesService) {}

  @ApiOperation({ summary: '点赞文章' })
  @Post('/like/:articleId')
  likeArticle(@GetUser() user: User, @Param('articleId') articleId: string) {
    return this.articleLikesService.likeArticle(articleId, user.id);
  }

  @ApiOperation({ summary: '取消点赞文章' })
  @Post('/unlike/:articleId')
  unlikeArticle(@GetUser() user: User, @Param('articleId') articleId: string) {
    return this.articleLikesService.unlikeArticle(articleId, user.id);
  }
}
