import { Column } from 'typeorm';
import { MessageType } from '@/modules/message/entities/message.entity';

export class SendMsgDto {
  @Column()
  content: string;

  @Column({
    type: 'enum',
    enum: MessageType,
    default: MessageType.TEXT
  })
  type: MessageType;

  @Column()
  receiverId: string;

  @Column()
  replyToId?: string;
}