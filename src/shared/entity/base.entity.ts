import {
  BeforeInsert,
  CreateDateColumn,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { generateSnowflakeId } from '../utils';

export abstract class BaseEntity {
  @PrimaryColumn({ type: 'bigint' })
  id: string;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = generateSnowflakeId();
    }
  }
}
