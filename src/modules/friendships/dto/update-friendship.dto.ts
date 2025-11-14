import { IsString } from 'class-validator';

export class UpdateFriendshipDto {
  @IsString()
  id: string;

  @IsString()
  status: string;
}
