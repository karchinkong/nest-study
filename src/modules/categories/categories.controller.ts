import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from '@/modules/categories/categories.service';
import { ApiOperation } from '@nestjs/swagger';

/**
 * 分类控制器
 * 处理文章分类相关的HTTP请求
 */
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({ summary: '获取所有分类（树形结构）' })
  @Get()
  getAllCategories() {
    return this.categoriesService.findTrees();
  }
}
