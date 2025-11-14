import { Column } from 'typeorm';

export class CreateTagDto {
  @Column('simple-array')
  name: string[];
}