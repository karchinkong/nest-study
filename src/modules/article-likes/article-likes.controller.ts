import { Controller, Param, Post } from '@nestjs/common';
import { User } from '@/modules/users/entities';
import { GetUser } from '@/common/decorators/get-user.decorator';
import { ArticleLikesService } from '@/modules/article-likes/article-likes.service';

@Controller('article-likes')
export class ArticleLikesController {
  constructor(private readonly articleLikesService: ArticleLikesService) {}

  @Post('/like/:articleId')
  likeArticle(@GetUser() user: User, @Param('articleId') articleId: string) {
    return this.articleLikesService.likeArticle(articleId, user.id);
  }

  @Post('/unlike/:articleId')
  unlikeArticle(@GetUser() user: User, @Param('articleId') articleId: string) {
    return this.articleLikesService.unlikeArticle(articleId, user.id);
  }
}
