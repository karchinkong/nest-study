import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@/shared/entity/base.entity';
import { User } from '@/modules/users/entities';
import { Article } from '@/modules/articles/entities/article.entity';

@Entity('article_views')
export class ArticleViews extends BaseEntity {
  @Column({ name: 'user_id', nullable: true })
  userId: string | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User | null;

  @Column({ name: 'articles_id' })
  articlesId: string;

  @ManyToOne(() => Article)
  @JoinColumn({ name: 'articles_id' })
  article: Article;
}
