import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ConfigService } from '@nestjs/config';
import { AppConfigModule } from '@/config/config.module';
import { getConfig } from '@/config';

@Module({
  imports: [
    RedisModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: (configService: ConfigService) => {
        const config = getConfig(configService);
        return {
          type: 'single',
          url: config.redis?.url,
          options: {},
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class RedisConfigModule {}
