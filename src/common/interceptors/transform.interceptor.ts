import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

export interface Response<T> {
  data: T;
  code: number;
  message: string;
  success: boolean;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<Response<T>> | Promise<Observable<Response<T>>> {
    return next.handle().pipe(
      map((rawData) => ({
        data: rawData, // 控制器返回的原始数据
        code: 200,
        message: '请求成功',
        success: true,
      })),
    );
  }
}
