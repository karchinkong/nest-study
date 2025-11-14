import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FriendShips } from '@/modules/friendships/entities/friendships.entity';
import { CreateFriendshipDto } from '@/modules/friendships/dto/create-friendship.dto';
import { User } from '@/modules/users/entities';
import { FriendshipStatus } from '@/modules/friendships/enums/friendships.enum';
import { ErrorException } from '@/common/exceptions/error.exception';
import { UserExceptionCode } from '@/common/exceptions/modules/user.exception';
import { FriendShipsExceptionCode } from '@/common/exceptions/modules/friendships.exception';
import { UpdateFriendshipDto } from '@/modules/friendships/dto/update-friendship.dto';

@Injectable()
export class FriendshipsService {
  constructor(
    @InjectRepository(FriendShips)
    private readonly friendShipsRepository: Repository<FriendShips>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getAllFriendships(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: [
        'sentFriendRequests.addressee',
        'receivedFriendRequests.requester',
      ],
    });

    if (!user) {
      throw new ErrorException(UserExceptionCode.USER_NOT_FOUND);
    }

    return user.getFriends();
  }

  // 获取用户的好友请求（收到的）
  async getPendingFriendships(userId: string) {
    return await this.friendShipsRepository.find({
      where: {
        addressee: { id: userId },
        status: FriendshipStatus.PENDING,
      },
      relations: ['requester'],
    });
  }

  // 接受好友申请
  async updateFriendshipStatus(updateFriendshipDto: UpdateFriendshipDto) {
    const r = await this.friendShipsRepository.find({
      where: {
        id: updateFriendshipDto.id,
      }
    });

    if (!r) {
      throw new ErrorException(FriendShipsExceptionCode.NOT_EXIST);
    }

    return await this.friendShipsRepository.save(
      {
        ...r,
        ...updateFriendshipDto
      }
    );
  }

  // 发送好友申请
  async createFriendShip(createFriendshipDto: CreateFriendshipDto) {
    const { requesterId, addresseeId } = createFriendshipDto;

    // 检查是否已经存在好友关系
    const existingFriendship = await this.friendShipsRepository.findOne({
      where: [
        { requester: { id: requesterId }, addressee: { id: addresseeId } },
        { requester: { id: addresseeId }, addressee: { id: requesterId } },
      ],
    });

    if (existingFriendship) {
      throw new ErrorException(FriendShipsExceptionCode.EXIST);
    }

    const pro = await Promise.all([
      this.userRepository.findOneBy({ id: requesterId }),
      this.userRepository.findOneBy({ id: addresseeId }),
    ]);

    const requester = pro[0] as User;
    const addressee = pro[1] as User;

    const friendship = this.friendShipsRepository.create({
      requester,
      addressee,
      status: FriendshipStatus.PENDING,
    });

    return await this.friendShipsRepository.save(friendship);
  }
}
