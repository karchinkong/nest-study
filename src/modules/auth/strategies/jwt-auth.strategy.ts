import { User } from '@/modules/users/entities';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getConfig } from '@/config';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { generateRedisKeyByUserId } from '@/shared/utils';
import Redis from 'ioredis';
import { UsersService } from '@/modules/users/users.service';

export interface JwtPayload {
  id: string;
  userInfo: User;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectRedis()
    private readonly redis: Redis,
    protected configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    const config = getConfig(configService);
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwt.secret,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: JwtPayload) {
    // 从请求头中提取 token
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const authHeader = request.headers['authorization'];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const token = authHeader.replace('Bearer ', '') || '';

    const currentUserToken = await this.redis.get(
      generateRedisKeyByUserId(payload.id),
    );

    // 如果跟redis里面的token不一致,则校验不通过
    if (token !== currentUserToken) {
      throw new UnauthorizedException('Token mismatch');
    }

    const user = await this.usersService.findOne({
      id: payload.id,
    });

    if (user.deletedAt) {
      throw new UnauthorizedException('User is not active');
    }

    return payload.userInfo;
  }
}
