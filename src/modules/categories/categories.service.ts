import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, TreeRepository } from 'typeorm';
import { Categories } from '@/modules/categories/entities/categories.entity';

@Injectable()
export class CategoriesService implements OnModuleInit {
  private readonly categoriesRepository: TreeRepository<Categories>;

  async onModuleInit() {
    const count = await this.categoriesRepository.count();

    if (count === 0) {
      const rootCategory = this.categoriesRepository.create({
        name: '根目录'
      });

      await this.categoriesRepository.save(rootCategory);

      const childCategory = this.categoriesRepository.create({
        name: '子目录',
        parent: rootCategory
      });

      await this.categoriesRepository.save(childCategory);
    }
  }

  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {
    this.categoriesRepository = entityManager.getTreeRepository(Categories);
  }

  // 获取完整的树形结构
  async findTrees(): Promise<Categories[]> {
    return this.categoriesRepository.findTrees();
  }

  // 获取所有根分类
  async findRoots(): Promise<Categories[]> {
    return await this.categoriesRepository.findRoots();
  }
}
