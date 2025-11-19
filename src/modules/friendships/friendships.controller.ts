import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FriendshipsService } from '@/modules/friendships/friendships.service';
import { CreateFriendshipDto } from '@/modules/friendships/dto/create-friendship.dto';
import { UpdateFriendshipDto } from '@/modules/friendships/dto/update-friendship.dto';
import { ApiOperation } from '@nestjs/swagger';

/**
 * 好友关系控制器
 * 处理用户好友关系相关的HTTP请求
 */
@Controller('friendships')
export class FriendshipsController {
  constructor(private friendshipsService: FriendshipsService) {}

  @ApiOperation({ summary: '获取用户的好友列表' })
  @Get(':userId')
  getFriendshipsByUserId(@Param('userId') userId: string) {
    return this.friendshipsService.getAllFriendships(userId);
  }

  @ApiOperation({ summary: '发送好友申请' })
  @Post('/add')
  createFriendship(@Body() createFriendshipDto: CreateFriendshipDto) {
    return this.friendshipsService.createFriendShip(createFriendshipDto);
  }

  @ApiOperation({ summary: '获取用户的待处理好友申请' })
  @Get('/pending/:userId')
  getPendingFriendshipsByUserId(@Param('userId') userId: string) {
    return this.friendshipsService.getPendingFriendships(userId);
  }

  @ApiOperation({ summary: '更新好友关系状态' })
  @Post('/status/update')
  updateFriendshipsStatus(@Body() updateFriendshipDto: UpdateFriendshipDto) {
    return this.friendshipsService.updateFriendshipStatus(updateFriendshipDto);
  }
}
