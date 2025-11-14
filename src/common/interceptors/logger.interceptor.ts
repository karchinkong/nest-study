import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggerInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const { method, url } = request;

    this.logger.log(
      `🚀 \x1b[32m请求开始\x1b[0m \x1b[33m${method}\x1b[0m \x1b[36m${url}\x1b[0m`,
    );

    const startTime = Date.now(); // 请求开始时间

    return next.handle().pipe(
      tap(() => {
        // 响应完成后记录日志
        const duration = Date.now() - startTime;
        // 在生产环境中，你可能会想记录到文件或日志系统
        this.logger.log(
          `✅ \x1b[32m请求结束\x1b[0m \x1b[33m${method}\x1b[0m \x1b[36m${url}\x1b[0m - \x1b[35m耗时: ${duration}ms\x1b[0m`,
        );
      }),
    );
  }
}
