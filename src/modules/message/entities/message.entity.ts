import { BaseEntity } from '@/shared/entity/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '@/modules/users/entities';
import { Conversation } from '@/modules/message/entities/conversation.entity';

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
  VOICE = 'voice',
  VIDEO = 'video'
}

export enum MessageStatus {
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed'
}

@Entity('messages')
export class Message extends BaseEntity {
  @Column()
  content: string;

  @Column({
    type: 'enum',
    enum: MessageType,
    default: MessageType.TEXT
  })
  type: MessageType;

  @Column({
    type: 'enum',
    enum: MessageStatus,
    default: MessageStatus.SENT
  })
  status: MessageStatus;

  // 发送者
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  sender: User;

  @Column()
  senderId: string;

  // 接收者
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  receiver: User;

  @Column()
  receiverId: string;

  // 会话ID（可选，用于分组查询）
  @Column({ nullable: true })
  conversationId: string;

  // 回复的消息
  @ManyToOne(() => Message, { nullable: true })
  replyTo: Message;

  // 回复的消息ID（用于实现回复功能）
  @Column({ nullable: true })
  replyToId: string;

  // 消息是否被发送者删除
  @Column({ default: false })
  isDeletedBySender: boolean;

  // 消息是否被接收者删除
  @Column({ default: false })
  isDeletedByReceiver: boolean;

  // 修正：正确的会话关系定义
  @ManyToOne(() => Conversation, conversation => conversation.messages, { onDelete: 'CASCADE' })
  conversation: Conversation;
}
