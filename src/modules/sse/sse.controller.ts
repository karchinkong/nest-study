import { Controller, Sse, OnModuleDestroy } from '@nestjs/common';
import { Observable } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller('sse')
export class SseController implements OnModuleDestroy {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  @Sse('events')
  sseEvents() {
    return new Observable((observer) => {

      const eventHandler = (data: any) => {
        observer.next({ data });
      };

      this.eventEmitter.on('broadcaster', eventHandler);

      return () => {
        // 移除事件监听器
        this.eventEmitter.off('broadcaster', eventHandler);
      };
    });
  }

  onModuleDestroy() {}
}
