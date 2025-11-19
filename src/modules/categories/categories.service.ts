import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, TreeRepository } from 'typeorm';
import { Categories } from '@/modules/categories/entities/categories.entity';

/**
 * 分类服务
 * 处理文章分类相关的业务逻辑，支持树形结构
 */
@Injectable()
export class CategoriesService implements OnModuleInit {
  private readonly categoriesRepository: TreeRepository<Categories>;

  /**
   * 模块初始化时自动创建默认分类
   */
  async onModuleInit() {
    // 检查是否已有分类数据
    const count = await this.categoriesRepository.count();

    if (count === 0) {
      // 创建根目录
      const rootCategory = this.categoriesRepository.create({
        name: '根目录',
      });

      await this.categoriesRepository.save(rootCategory);

      // 创建子目录
      const childCategory = this.categoriesRepository.create({
        name: '子目录',
        parent: rootCategory,
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
