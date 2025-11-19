import { Body, Controller, Get, Post } from '@nestjs/common';
import { TagsService } from '@/modules/tags/tags.service';
import { CreateTagDto } from '@/modules/tags/dto/create-tag.dto';
import { ApiOperation } from '@nestjs/swagger';

/**
 * 标签控制器
 * 处理文章标签相关的HTTP请求
 */
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @ApiOperation({ summary: '批量创建标签' })
  @Post('create')
  batchCreateTag(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.batchCreateTag(createTagDto);
  }

  @ApiOperation({ summary: '获取所有标签' })
  @Get()
  getAllTags() {
    return this.tagsService.getAllTags();
  }
}
