import { Body, Controller, Get, Post } from '@nestjs/common';
import { TagsService } from '@/modules/tags/tags.service';
import { CreateTagDto } from '@/modules/tags/dto/create-tag.dto';

@Controller('tags')
export class TagsController {

  constructor(private readonly tagsService: TagsService) {}

  @Post('create')
  batchCreateTag(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.batchCreateTag(createTagDto);
  }

  @Get()
  getAllTags() {
    return this.tagsService.getAllTags();
  }

}
