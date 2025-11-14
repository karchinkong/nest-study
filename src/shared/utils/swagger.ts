import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { getAppConfig } from '@/config';

export const useSwagger = (app: INestApplication) => {
  const appConfig = getAppConfig(app);

  // 创建 Swagger 文档配置
  const config = new DocumentBuilder()
    .setTitle(appConfig.swagger.title) // 例如 'Cats example'
    .setDescription(appConfig.swagger?.description || '') // 例如 'The cats API description'
    .setVersion(appConfig.swagger.version) // 你的API版本
    .build();

  // 基于应用实例和配置创建文档对象
  const document = SwaggerModule.createDocument(app, config);

  // 设置Swagger UI的访问路径（例如 'api'），并传入文档对象
  SwaggerModule.setup('api', app, document);
};
