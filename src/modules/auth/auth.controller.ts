import { Body, Controller, Headers, Post } from '@nestjs/common';
import { AuthService } from '@/modules/auth/auth.service';
import { LoginDto } from '@/modules/auth/dto/login.dto';
import { Public } from '@/common/decorators/jwt-auth.decorator';
import { ApiOperation } from '@nestjs/swagger';
import { ErrorException } from '@/common/exceptions/error.exception';
import { UserExceptionCode } from '@/common/exceptions/modules/user.exception';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiOperation({
    summary: 'User Login And Return Token',
  })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const d = await this.authService.login(loginDto);

    return {
      accessToken: d.token.accessToken,
      expireAt: d.token.accessExpiresAt,
      user: d.user,
    };
  }

  @Public()
  @Post('logout')
  async logout(@Headers('authorization') authHeader: string) {
    const tokenFromHeader = authHeader?.replace('Bearer ', '');

    if (!tokenFromHeader) {
      throw new ErrorException(UserExceptionCode.USER_NOT_FOUND);
    }

    return await this.authService.logout(tokenFromHeader);
  }
}
