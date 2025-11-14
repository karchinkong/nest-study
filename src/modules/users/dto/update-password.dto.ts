import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({
    description: 'user password',
    required: true,
  })
  @MinLength(8, {
    message: 'Password must be at least 8 characters',
  })
  @IsString()
  newPassword: string;

  @ApiProperty({
    description: 'user password',
    required: true,
  })
  @MinLength(8, {
    message: 'Password must be at least 8 characters',
  })
  @IsString()
  oldPassword: string;
}
