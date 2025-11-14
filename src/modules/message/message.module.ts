import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from '@/modules/message/message.service';
import { Message } from '@/modules/message/entities/message.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from '@/modules/message/entities/conversation.entity';
import { User } from '@/modules/users/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Conversation, User])],
  providers: [MessageService],
  controllers: [MessageController]
})
export class MessageModule {}
