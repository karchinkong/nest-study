import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FriendshipsService } from '@/modules/friendships/friendships.service';
import { CreateFriendshipDto } from '@/modules/friendships/dto/create-friendship.dto';
import { UpdateFriendshipDto } from '@/modules/friendships/dto/update-friendship.dto';

@Controller('friendships')
export class FriendshipsController {
  constructor(private friendshipsService: FriendshipsService) {}

  @Get(':userId')
  getFriendshipsByUserId(@Param('userId') userId: string) {
    return this.friendshipsService.getAllFriendships(userId);
  }

  @Post('/add')
  createFriendship(@Body() createFriendshipDto: CreateFriendshipDto) {
    return this.friendshipsService.createFriendShip(createFriendshipDto);
  }

  @Get('/pending/:userId')
  getPendingFriendshipsByUserId(@Param('userId') userId: string) {
    return this.friendshipsService.getPendingFriendships(userId);
  }

  @Post('/status/update')
  updateFriendshipsStatus(@Body() updateFriendshipDto: UpdateFriendshipDto) {
    return this.friendshipsService.updateFriendshipStatus(updateFriendshipDto);
  }
}
