import { UsersService } from './users.service';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import { Public } from '@/common/decorators/jwt-auth.decorator';
import { GetUser } from '@/common/decorators/get-user.decorator';
import { User } from '@/modules/users/entities';
import { UpdatePasswordDto } from '@/modules/users/dto/update-password.dto';

/**
 * 用户控制器
 * 处理用户管理相关的HTTP请求
 */
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '创建新用户' })
  @Public()
  @Post('/create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: '获取所有用户' })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: '根据ID获取用户' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne({ id });
  }

  @ApiOperation({ summary: '删除用户' })
  @Delete('/delete')
  remove(@GetUser() user: User) {
    return this.usersService.remove(user.id);
  }

  @ApiOperation({ summary: '修改用户密码' })
  @Post('/update')
  updatePassword(
    @GetUser() user: User,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.usersService.updatePassword(user.id, updatePasswordDto);
  }
}
