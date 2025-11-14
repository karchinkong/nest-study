import { Column, Entity, JoinColumn, Tree, TreeChildren, TreeParent } from 'typeorm';
import { BaseEntity } from '@/shared/entity/base.entity';

@Entity()
@Tree('closure-table')
export class Categories extends BaseEntity {
  @Column()
  name: string;

  @TreeChildren()
  children: Categories[];

  @TreeParent()
  @JoinColumn({ name: 'parent_id' })
  parent: Categories;

  @Column({ name: 'parent_id', nullable: true })
  parentId: string;
}
