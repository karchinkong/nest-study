import { User } from '@/modules/users/entities';
import { JwtService } from '@nestjs/jwt';
import { getConfig } from '@/config';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { generateRedisKeyByUserId } from '@/shared/utils';
import { JwtPayload } from '@/modules/auth/strategies/jwt-auth.strategy';
import Redis from 'ioredis';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRedis()
    private readonly redis: Redis,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async create(user: User) {
    const payload: JwtPayload = {
      id: user.id,
      userInfo: user,
    };

    const accessToken = this.jwtService.sign(payload);

    const appConfig = getConfig(this.configService);

    const accessExpiresAt = new Date();
    accessExpiresAt.setSeconds(
      accessExpiresAt.getSeconds() + appConfig.jwt.expiresIn,
    );

    const redisKey = generateRedisKeyByUserId(user.id);
    await this.redis.set(redisKey, accessToken, 'EX', appConfig.jwt.expiresIn);

    return { accessToken, accessExpiresAt };
  }

  async remove(token: string) {
    const data: JwtPayload = this.jwtService.decode(token);
    const redisKey = generateRedisKeyByUserId(data.id);
    await this.redis.del(redisKey);
  }
}
