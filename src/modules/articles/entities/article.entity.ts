import { BaseEntity } from '@/shared/entity/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '@/modules/users/entities';
import { Tags } from '@/modules/tags/entities/tags.entity';
import { Categories } from '@/modules/categories/entities/categories.entity';
import { ArticleLikes } from '@/modules/article-likes/entities/article-likes.entity';
import { ArticleFavorites } from '@/modules/article-favorites/entities/article-favorites.entity';
import { ArticleViews } from '@/modules/article-views/entities/article-views.entity';

@Entity('articles')
export class Article extends BaseEntity {
  @Column({ name: 'author_id' })
  authorId: string;

  @ManyToOne(() => User, { cascade: true })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column()
  content: string;

  @Column()
  title: string;

  @ManyToMany(() => Tags, { cascade: true })
  @JoinTable()
  tags: Tags[];

  @ManyToOne(() => Categories)
  @JoinColumn({ name: 'category_id' })
  category: Categories;

  @Column({ name: 'category_id' })
  categoryId: string;

  // 计算字段，不直接存储
  @Column({ default: 0 })
  likeCount: number;

  @OneToMany(() => ArticleLikes, (like) => like.article)
  likes: ArticleLikes[];

  @Column({ default: 0 })
  favoriteCount: number;

  @OneToMany(() => ArticleFavorites, (favorite) => favorite.article)
  favorites: ArticleFavorites[];

  @Column({ default: 0 })
  viewCount: number;

  @OneToMany(() => ArticleViews, (view) => view.article)
  views: ArticleViews[];
}
