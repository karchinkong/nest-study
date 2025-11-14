import { IsString } from 'class-validator';

export class CreateFriendshipDto {
  @IsString()
  requesterId: string;

  @IsString()
  addresseeId: string;
}
