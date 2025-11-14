import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tags } from '@/modules/tags/entities/tags.entity';
import { Repository } from 'typeorm';
import { CreateTagDto } from '@/modules/tags/dto/create-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tags)
    private readonly tagsRepository: Repository<Tags>,
  ) {}

  async batchCreateTag(createTagDto: CreateTagDto) {
    for (const name of createTagDto.name) {
      const tag = this.tagsRepository.create({ name });
      await this.tagsRepository.save(tag);
    }
  }

  async getAllTags() {
    return await this.tagsRepository.find();
  }
}
