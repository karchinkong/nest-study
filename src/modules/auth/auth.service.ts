import { Injectable } from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';
import { LoginDto } from '@/modules/auth/dto/login.dto';
import { verify } from 'argon2';
import { ErrorException } from '@/common/exceptions/error.exception';
import { UserExceptionCode } from '@/common/exceptions/modules/user.exception';
import { AuthExceptionCode } from '@/common/exceptions/modules/auth.exception';
import { RefreshTokenService } from '@/modules/auth/refresh-token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userService.findOne({
      username: loginDto.username,
    });

    if (!user) {
      throw new ErrorException(UserExceptionCode.USER_NOT_FOUND);
    }

    const isPass = await verify(user.password, loginDto.password);

    if (!isPass) {
      throw new ErrorException(AuthExceptionCode.INVALID_CREDENTIALS);
    }

    const token = await this.refreshTokenService.create(user);

    return {
      token,
      user,
    };
  }

  async logout(token: string) {
    return await this.refreshTokenService.remove(token);
  }
}
