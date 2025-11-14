import { INestApplication } from '@nestjs/common';
import { useMiddleware } from '@/common/middleware';
import { usePipes } from '@/common/pipes';
import { useFilters } from '@/common/filters';
import { useInterceptors } from '@/common/interceptors';

export const appUse = (app: INestApplication) => {
  // 使用中间件
  useMiddleware(app);

  // 使用管道,信息校验
  usePipes(app);

  // 异常错误捕捉处理
  useFilters(app);

  // 拦截器
  useInterceptors(app);
};
