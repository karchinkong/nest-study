import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from '@/shared/entity/base.entity';
import { User } from '@/modules/users/entities';
import { Article } from '@/modules/articles/entities/article.entity';

@Entity()
@Unique(['articlesId', 'userId'])
export class ArticleLikes extends BaseEntity {
  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'articles_id' })
  articlesId: string;

  @ManyToOne(() => Article, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'articles_id' })
  article: Article;
}
