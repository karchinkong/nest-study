import { Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export class CreateArticleDto {
  @Column()
  @ApiProperty({
    description: '内容(保存为markdown格式)'
  })
  content: string;

  @Column()
  @ApiProperty({
    description: '标题'
  })
  title: string;

  @Column('simple-array', { nullable: true })
  @ApiProperty({
    description: '标签ID组',
    example: ['44123', '12312312']
  })
  tagIds?: string[];

  @Column()
  @ApiProperty({
    description: '分类ID'
  })
  categoryId: string;
}