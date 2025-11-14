import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/modules/users/entities';
import { FriendShips } from '@/modules/friendships/entities/friendships.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, FriendShips])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
