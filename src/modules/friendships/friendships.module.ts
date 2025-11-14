import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/modules/users/entities';
import { FriendShips } from '@/modules/friendships/entities/friendships.entity';
import { FriendshipsController } from './friendships.controller';
import { FriendshipsService } from '@/modules/friendships/friendships.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, FriendShips])],
  controllers: [FriendshipsController],
  providers: [FriendshipsService],
  exports: [FriendshipsService],
})
export class FriendshipsModule {}
