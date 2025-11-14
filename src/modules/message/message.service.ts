import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Message,
  MessageStatus,
} from '@/modules/message/entities/message.entity';
import { Repository } from 'typeorm';
import { Conversation } from '@/modules/message/entities/conversation.entity';
import { SendMsgDto } from '@/modules/message/dto/send-msg.dto';
import { ErrorException, ErrorExceptionCode } from '@/common/exceptions/error.exception';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,

    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
  ) {}

  async getConversationMessages(conversationId: string) {
    const messages = await this.messageRepository.find({
      where: { conversationId },
    });
    return messages;
  }

  async deleteConversation(userId: string, conversationId: string) {
    const conversation = await this.conversationRepository.findOne({ where: { id: conversationId } });

    if (!conversation) {
      throw new ErrorException(ErrorExceptionCode.NOT_EXIST);
    }

    const isUser1 = conversation.user1Id === userId;

    if (isUser1) {
      conversation.isDeleteByUser1 = true;
    } else {
      conversation.isDeleteByUser2 = true;
    }

    if (conversation.isDeleteByUser1 && conversation.isDeleteByUser2) {
      await this.messageRepository.delete({
        conversationId
      });
      await this.conversationRepository.delete({
        id: conversationId,
      });
    } else {
      await this.conversationRepository.save(conversation);
    }
  }

  async sendMessage(userId: string, sendMsgDto: SendMsgDto) {
    const conversation = await this.getOrCreateConversation(
      userId,
      sendMsgDto.receiverId,
    );
    const messageData: Partial<Message> = {
      senderId: userId,
      receiverId: sendMsgDto.receiverId,
      content: sendMsgDto.content,
      type: sendMsgDto.type,
      conversationId: conversation.id,
      status: MessageStatus.SENT,
    };

    if (sendMsgDto?.replyToId) {
      messageData.replyToId = sendMsgDto.replyToId;
    }

    const message = this.messageRepository.create(messageData);
    const savedMessage = await this.messageRepository.save(message);

    await this.updateConversationLastMessage(conversation.id, savedMessage);

    return savedMessage;
  }

  async getUserMessages(userId: string) {
    const conversations = await this.conversationRepository
      .createQueryBuilder('conversations')
      .leftJoinAndSelect('conversations.user1', 'user1')
      .leftJoinAndSelect('conversations.user2', 'user2')
      .where(
        'conversations.user1Id = :userId OR conversations.user2Id = :userId',
        { userId },
      )
      .orderBy('conversations.lastMessageAt', 'DESC')
      .getMany();

    return conversations
      .filter(conversation => conversation.user1 && conversation.user2)
      .filter(conversation => {
        return conversation.user1Id === userId ? !conversation.isDeleteByUser1 : !conversation.isDeleteByUser2;
      });
  }

  // 私有方法：更新会话最后消息（修正版）
  private async updateConversationLastMessage(
    conversationId: string,
    message: Message,
  ) {
    return await this.conversationRepository.update(conversationId, {
      lastMessage: message.content,
      lastMessageId: message.id,
      lastMessageType: message.type,
      lastMessageAt: message.createAt,
    });
  }

  private sortUserId(user1Id: string, user2Id: string) {
    return [user1Id, user2Id].sort();
  }

  private async getOrCreateConversation(user1Id: string, user2Id: string) {
    const [minId, maxId] = this.sortUserId(user1Id, user2Id);

    let conversation = await this.conversationRepository.findOne({
      where: {
        user1Id: minId,
        user2Id: maxId,
      },
    });

    if (!conversation) {
      conversation = this.conversationRepository.create({
        user1Id: minId,
        user2Id: maxId,
      });
      conversation = await this.conversationRepository.save(conversation);
    }

    return conversation;
  }
}
