import { Module } from '@nestjs/common';
import { ChatGateway } from '@/modules/chat/chat.gateway';

@Module({
  providers: [ChatGateway]
})
export class ChatModule {}
