import { BaseEntity } from '@/shared/entity/base.entity';
import { Exclude } from 'class-transformer';
import { Column, DeleteDateColumn, Entity, OneToMany } from 'typeorm';
import { FriendShips } from '@/modules/friendships/entities/friendships.entity';
import { FriendshipStatus } from '@/modules/friendships/enums/friendships.enum';
import { Conversation } from '@/modules/message/entities/conversation.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({
    unique: true,
  })
  username: string;

  @Exclude()
  @Column()
  password: string;

  @Column({
    unique: true,
    nullable: true,
  })
  email: string;

  @Column({
    default: true,
  })
  isActive: boolean;

  @Column({
    nullable: true,
  })
  nickname: string;

  // 用户发起的好友关系
  @OneToMany(() => FriendShips, friendship => friendship.requester)
  sentFriendRequests: FriendShips[];

  // 用户收到的好友关系
  @OneToMany(() => FriendShips, friendship => friendship.addressee)
  receivedFriendRequests: FriendShips[];

  // 修正反向关系定义
  @OneToMany(() => Conversation, (conversation) => conversation.user1)
  conversationsAsUser1: Conversation[];

  @OneToMany(() => Conversation, (conversation) => conversation.user2)
  conversationsAsUser2: Conversation[];

  @DeleteDateColumn() // 确保添加这行
  deletedAt: Date;

  // 获取用户的所有好友（便捷方法）
  getFriends(): User[] {
    const friends: User[] = [];

    // 作为请求者被接受的好友
    this.sentFriendRequests?.forEach(friendship => {
      if (friendship.status === FriendshipStatus.ACCEPTED) {
        friends.push(friendship.addressee);
      }
    });

    // 作为接收者被接受的好友
    this.receivedFriendRequests?.forEach(friendship => {
      if (friendship.status === FriendshipStatus.ACCEPTED) {
        friends.push(friendship.requester);
      }
    });

    return friends;
  }
}
