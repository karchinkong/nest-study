import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tags } from '@/modules/tags/entities/tags.entity';
import { Repository } from 'typeorm';
import { CreateTagDto } from '@/modules/tags/dto/create-tag.dto';

/**
 * 标签服务
 * 处理文章标签相关的业务逻辑
 */
@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tags)
    private readonly tagsRepository: Repository<Tags>,
  ) {}

  /**
   * 批量创建标签
   * @param createTagDto 创建标签DTO（包含标签名称数组）
   */
  async batchCreateTag(createTagDto: CreateTagDto) {
    for (const name of createTagDto.name) {
      const tag = this.tagsRepository.create({ name });
      await this.tagsRepository.save(tag);
    }
  }

  /**
   * 获取所有标签
   * @returns 标签列表
   */
  async getAllTags() {
    return await this.tagsRepository.find();
  }
}
