import { Controller, Get, Param, Post } from '@nestjs/common';
import { ArticleFavoritesService } from '@/modules/article-favorites/article-favorites.service';
import { User } from '@/modules/users/entities';
import { GetUser } from '@/common/decorators/get-user.decorator';
import { ApiOperation } from '@nestjs/swagger';

/**
 * 文章收藏控制器
 * 处理文章收藏相关的HTTP请求
 */
@Controller('article-favorites')
export class ArticleFavoritesController {
  constructor(
    private readonly articleFavoritesService: ArticleFavoritesService,
  ) {}

  @ApiOperation({ summary: '收藏文章' })
  @Post('favorite/:articleId')
  favorite(@GetUser() user: User, @Param('articleId') articleId: string) {
    return this.articleFavoritesService.favoriteArticle(articleId, user.id);
  }

  @ApiOperation({ summary: '取消收藏文章' })
  @Post('unfavorite/:articleId')
  unfavorite(@GetUser() user: User, @Param('articleId') articleId: string) {
    return this.articleFavoritesService.unfavoriteArticle(articleId, user.id);
  }

  @ApiOperation({ summary: '获取我的收藏列表' })
  @Get('mine')
  listMine(@GetUser() user: User) {
    return this.articleFavoritesService.findMyFavorites(user.id);
  }
}
