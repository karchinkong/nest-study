import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

/**
 * SSE（Server-Sent Events）服务
 * 处理服务端向客户端推送事件
 */
@Injectable()
export class SseService {
  constructor(private eventEmitter: EventEmitter2) {}

  /**
   * 发送事件
   * @param eventName 事件名称
   * @param data 事件数据
   */
  emit(eventName: string, data: unknown) {
    this.eventEmitter.emit(eventName, data);
  }
}
