import { BaseEntity } from '@/shared/entity/base.entity';
import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import { User } from '@/modules/users/entities';
import { FriendshipStatus } from '@/modules/friendships/enums/friendships.enum';

@Entity('friend_ships')
@Unique(['requester', 'addressee'])
export class FriendShips extends BaseEntity {
  // 好友请求发起者
  @ManyToOne(() => User, user => user.sentFriendRequests, { eager: true })
  requester: User;

  // 好友请求接收者
  @ManyToOne(() => User, user => user.receivedFriendRequests, { eager: true })
  addressee: User;

  // 好友关系状态
  @Column({
    type: 'enum',
    enum: FriendshipStatus,
    default: FriendshipStatus.PENDING
  })
  status: FriendshipStatus;
}
