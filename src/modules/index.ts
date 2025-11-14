import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FriendshipsModule } from './friendships/friendships.module';
import { ChatModule } from './chat/chat.module';
import { MessageModule } from './message/message.module';
import { ArticlesModule } from './articles/articles.module';
import { TagsModule } from './tags/tags.module';
import { CategoriesModule } from './categories/categories.module';
import { ArticleLikesModule } from './article-likes/article-likes.module';
import { SseModule } from './sse/sse.module';
import { ArticleFavoritesModule } from './article-favorites/article-favorites.module';

export const modules = [
  UsersModule,
  AuthModule,
  FriendshipsModule,
  ChatModule,
  MessageModule,
  ArticlesModule,
  TagsModule,
  CategoriesModule,
  ArticleLikesModule,
  ArticleFavoritesModule,
  SseModule,
];
