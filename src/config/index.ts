import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './index.interface';

export const getConfig = (configService: ConfigService): AppConfig => {
  const defaultConfig = configService.get<AppConfig>('default') as AppConfig;

  return defaultConfig;
};

export const getAppConfig = (app: INestApplication) => {
  const configService = app.get(ConfigService);

  return getConfig(configService);
};
