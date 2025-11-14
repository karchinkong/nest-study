import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from '@/modules/categories/categories.service';

@Controller('categories')
export class CategoriesController {

  constructor(private readonly categoriesService: CategoriesService) {
  }

  @Get()
  getAllCategories() {
    return this.categoriesService.findTrees();
  }

}
