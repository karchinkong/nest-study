import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import DefaultConfig from './config.default';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [DefaultConfig],
    }),
  ],
})
export class AppConfigModule {}
