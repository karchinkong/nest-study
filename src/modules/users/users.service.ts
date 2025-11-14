import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/modules/users/entities';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import { hash, verify } from 'argon2';
import { ErrorException } from '@/common/exceptions/error.exception';
import { UserExceptionCode } from '@/common/exceptions/modules/user.exception';
import { UpdatePasswordDto } from '@/modules/users/dto/update-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const isExist = await this.userRepository.exists({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });

    if (isExist) {
      throw new ErrorException(UserExceptionCode.USER_ALREADY_EXISTS);
    }

    const password = await hash(createUserDto.password, {
      timeCost: 5,
    });

    const newUser = this.userRepository.create({ ...createUserDto, password });
    const savedUser = await this.userRepository.save(newUser);
    return savedUser.id;
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(criteria: FindOptionsWhere<User>) {
    const user = await this.userRepository.findOne({
      where: criteria,
    });

    if (!user) {
      throw new ErrorException(UserExceptionCode.USER_NOT_FOUND);
    }

    return user;
  }

  // 软删用户
  async remove(id: string) {
    const user = await this.findOne({ id });

    if (!user) {
      throw new ErrorException(UserExceptionCode.USER_NOT_FOUND);
    }

    return await this.userRepository.softRemove(user);
  }

  // 更新用户密码
  async updatePassword(userId: string, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.findOne({ id: userId });

    if (!user) {
      throw new ErrorException(UserExceptionCode.USER_NOT_FOUND);
    }

    const isVerify = await verify(user.password, updatePasswordDto.oldPassword);

    if (!isVerify) {
      throw new ErrorException(UserExceptionCode.OLD_PASSWORD_NOT_SAME);
    }

    user.password = await hash(updatePasswordDto.newPassword, {
      timeCost: 5,
    });

    return await this.userRepository.save(user);
  }
}
