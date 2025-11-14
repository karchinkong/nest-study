import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/config.module';
import { DatabaseModule } from './shared/database/database.module';
import { RedisConfigModule } from './shared/redis/redis.module';
import { modules } from '@/modules';
import { appGuards } from '@/common/guards/app-guards';

@Module({
  imports: [AppConfigModule, DatabaseModule, RedisConfigModule, ...modules],
  controllers: [AppController],
  providers: [AppService, ...appGuards],
})
export class AppModule {}
