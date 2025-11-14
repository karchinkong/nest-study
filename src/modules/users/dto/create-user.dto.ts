import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'user name',
    example: 'user',
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'nick name',
  })
  @IsOptional()
  @IsString()
  nickname?: string;

  @ApiProperty({
    description: 'user password',
    required: true,
  })
  @MinLength(8, {
    message: 'Password must be at least 8 characters',
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'user email',
  })
  email: string;
}
