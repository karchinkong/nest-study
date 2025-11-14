import { BaseEntity } from '@/shared/entity/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('tags')
export class Tags extends BaseEntity {
  @Column({ length: 20 })
  name: string;
}
