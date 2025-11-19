import { Controller, Sse, OnModuleDestroy } from '@nestjs/common';
import { Observable } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ApiOperation } from '@nestjs/swagger';

/**
 * SSE（Server-Sent Events）控制器
 * 提供服务端向客户端实时推送事件的能力
 */
@Controller('sse')
export class SseController implements OnModuleDestroy {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  @ApiOperation({ summary: 'SSE事件流连接' })
  @Sse('events')
  sseEvents() {
    return new Observable((observer) => {
      const eventHandler = (data: any) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        observer.next({ data });
      };

      this.eventEmitter.on('broadcaster', eventHandler);

      return () => {
        // 移除事件监听器
        this.eventEmitter.off('broadcaster', eventHandler);
      };
    });
  }

  /**
   * 模块销毁时调用
   */
  onModuleDestroy() {}
}
