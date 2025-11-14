import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getAppConfig } from './config';
import { appUse } from '@/common/use';
import { initSnowflake, useSwagger } from '@/shared/utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfig = getAppConfig(app);
  const { server, snowflake } = appConfig;

  // 开启所有请求跨域
  app.enableCors();

  app.setGlobalPrefix(server.apiPrefix);

  initSnowflake(
    BigInt(snowflake?.workerId as number),
    BigInt(snowflake?.datacenterId as number),
  );

  // 中间件/管道 相关配置
  appUse(app);

  // swagger 配置使用
  useSwagger(app);

  await app.listen(server.port);
}

bootstrap();
