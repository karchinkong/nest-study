import { BaseEntity } from '@/shared/entity/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '@/modules/users/entities';
import { Message } from '@/modules/message/entities/message.entity';

@Entity('conversations')
export class Conversation extends BaseEntity {
  @Column({ name: 'user1_id' })
  user1Id: string;

  @ManyToOne(() => User, (user) => user.conversationsAsUser1, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user1_id' })
  user1: User;

  @Column({ name: 'user2_id' })
  user2Id: string;

  @ManyToOne(() => User, (user) => user.conversationsAsUser2, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user2_id' })
  user2: User;

  // 最后一条消息
  @Column({ nullable: true })
  lastMessage: string;

  @Column({ nullable: true })
  lastMessageId: string;

  @Column({ nullable: true })
  lastMessageType: string;

  // 最后消息时间
  @Column({ nullable: true })
  lastMessageAt: Date;

  // 未读消息数
  @Column({ default: 0 })
  unreadCount: number;

  // 关联的消息
  @OneToMany(() => Message, message => message.conversation)
  messages: Message[];

  @Column({ default: false })
  isDeleteByUser1: boolean;

  @Column({ default: false })
  isDeleteByUser2: boolean;

  // 工具方法：获取另一个用户的ID
  getOtherUserId(currentUserId: string): string {
    return this.user1Id === currentUserId ? this.user2Id : this.user1Id;
  }
}