import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Message,
  MessageStatus,
} from '@/modules/message/entities/message.entity';
import { Repository } from 'typeorm';
import { Conversation } from '@/modules/message/entities/conversation.entity';
import { SendMsgDto } from '@/modules/message/dto/send-msg.dto';
import {
  ErrorException,
  ErrorExceptionCode,
} from '@/common/exceptions/error.exception';

/**
 * 消息服务
 * 处理用户之间的消息发送、会话管理
 */
@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,

    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
  ) {}

  /**
   * 获取指定会话的所有消息
   * @param conversationId 会话ID
   * @returns 消息列表
   */
  async getConversationMessages(conversationId: string) {
    const messages = await this.messageRepository.find({
      where: { conversationId },
    });
    return messages;
  }

  /**
   * 删除会话（软删除，仅对当前用户生效）
   * @param userId 用户ID
   * @param conversationId 会话ID
   */
  async deleteConversation(userId: string, conversationId: string) {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new ErrorException(ErrorExceptionCode.NOT_EXIST);
    }

    // 判断是用户1还是用户2
    const isUser1 = conversation.user1Id === userId;

    if (isUser1) {
      conversation.isDeleteByUser1 = true;
    } else {
      conversation.isDeleteByUser2 = true;
    }

    // 如果双方都删除，则彻底删除会话和消息
    if (conversation.isDeleteByUser1 && conversation.isDeleteByUser2) {
      await this.messageRepository.delete({
        conversationId,
      });
      await this.conversationRepository.delete({
        id: conversationId,
      });
    } else {
      await this.conversationRepository.save(conversation);
    }
  }

  /**
   * 发送消息
   * @param userId 发送者ID
   * @param sendMsgDto 消息DTO
   * @returns 已发送的消息
   */
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

  /**
   * 获取用户的所有会话
   * @param userId 用户ID
   * @returns 会话列表（按最后消息时间排序）
   */
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
      .filter((conversation) => conversation.user1 && conversation.user2)
      .filter((conversation) => {
        return conversation.user1Id === userId
          ? !conversation.isDeleteByUser1
          : !conversation.isDeleteByUser2;
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

  /**
   * 私有方法：按顺序排列两个用户ID
   * @param user1Id 用户1 ID
   * @param user2Id 用户2 ID
   * @returns 排序后的用户ID数组
   */
  private sortUserId(user1Id: string, user2Id: string) {
    return [user1Id, user2Id].sort();
  }

  /**
   * 私有方法：获取或创建会话
   * @param user1Id 用户1 ID
   * @param user2Id 用户2 ID
   * @returns 会话对象
   */
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
