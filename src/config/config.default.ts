import { registerAs } from '@nestjs/config';
import { AppConfig } from './index.interface';

export default registerAs('default', (): AppConfig => {
  return {
    server: {
      port: (process.env.PORT || 3001) as number,
      apiPrefix: 'api',
      // 服务超时时间，单位：秒
      timeout: 60,
    },
    database: {
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: (process.env.DATABASE_PORT || 5432) as number,
      username: process.env.DATABASE_USERNAME || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'postgres',
      database: process.env.DATABASE_NAME || 'nest',
      url: process.env.DATABASE_URL as string,
      synchronize: true,
      logging: false, // 开启日志查看生成的 SQL
    },
    swagger: {
      title: 'API',
      version: '1.0',
    },
    snowflake: {
      workerId: (process.env.WORKER_ID || 0) as number,
      datacenterId: (process.env.DATACENTER_ID || 0) as number,
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'secret',
      expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN || 3600) as number,
    },
    redis: {
      type: 'single',
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    },
  };
});
