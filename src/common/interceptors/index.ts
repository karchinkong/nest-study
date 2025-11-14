import { INestApplication, ClassSerializerInterceptor } from '@nestjs/common';
import { TransformInterceptor } from '@/common/interceptors/transform.interceptor';
import { LoggerInterceptor } from '@/common/interceptors/logger.interceptor';
import { PostResponseInterceptor } from '@/common/interceptors/post-response.interceptor';
import { Reflector } from '@nestjs/core';

export const useInterceptors = (app: INestApplication) => {
  app.useGlobalInterceptors(
    // 数据格式转换
    new TransformInterceptor(),
    // 打印日志
    new LoggerInterceptor(),
    // Post请求返回201码转成200
    new PostResponseInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );
};
