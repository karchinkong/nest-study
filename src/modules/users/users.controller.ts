import { UsersService } from './users.service';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import { Public } from '@/common/decorators/jwt-auth.decorator';
import { GetUser } from '@/common/decorators/get-user.decorator';
import { User } from '@/modules/users/entities';
import { UpdatePasswordDto } from '@/modules/users/dto/update-password.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: 'create new user',
  })
  @Public()
  @Post('/create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({
    summary: 'Get all users',
  })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({
    summary: 'Get user by id',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne({ id });
  }

  @Delete('/delete')
  remove(@GetUser() user: User) {
    return this.usersService.remove(user.id);
  }

  @Post('/update')
  updatePassword(@GetUser() user: User, @Body() updatePasswordDto: UpdatePasswordDto) {
    return this.usersService.updatePassword(user.id, updatePasswordDto);
  }
}
