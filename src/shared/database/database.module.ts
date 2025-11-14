import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppConfigModule } from '@/config/config.module';
import { ConfigService } from '@nestjs/config';
import { getConfig } from '@/config';
import { SnakeNamingStrategy } from '@/shared/database/snake-naming.strategy';
import { Categories } from '@/modules/categories/entities/categories.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: (configService: ConfigService) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
        const { database } = getConfig(configService);
        return {
          ...database,
          autoLoadEntities: true,
          namingStrategy: new SnakeNamingStrategy(),
        } as TypeOrmModuleOptions;
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
