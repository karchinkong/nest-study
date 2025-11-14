import { Controller, Get, Param, Post } from '@nestjs/common';
import { ArticleFavoritesService } from '@/modules/article-favorites/article-favorites.service';
import { User } from '@/modules/users/entities';
import { GetUser } from '@/common/decorators/get-user.decorator';

@Controller('article-favorites')
export class ArticleFavoritesController {
  constructor(
    private readonly articleFavoritesService: ArticleFavoritesService,
  ) {}

  @Post('favorite/:articleId')
  favorite(@GetUser() user: User, @Param('articleId') articleId: string) {
    return this.articleFavoritesService.favoriteArticle(articleId, user.id);
  }

  @Post('unfavorite/:articleId')
  unfavorite(@GetUser() user: User, @Param('articleId') articleId: string) {
    return this.articleFavoritesService.unfavoriteArticle(articleId, user.id);
  }

  @Get('mine')
  listMine(@GetUser() user: User) {
    return this.articleFavoritesService.findMyFavorites(user.id);
  }
}
