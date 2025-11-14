import { RedisSingleOptions } from '@nestjs-modules/ioredis';

export interface Server {
  port: number;
  apiPrefix: string;
  timeout: number;
}

export interface DataBase {
  type: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  url: string;
  synchronize: boolean;
  dropSchema?: boolean;
  logging: boolean;
}

export interface Swagger {
  title: string;
  version: string;
  description?: string;
}

export interface SnowflakeConfig {
  workerId: number;
  datacenterId: number;
}

export interface JwtConfig {
  secret: string;
  expiresIn: number;
}

export interface AppConfig {
  server: Server;
  database: DataBase;
  swagger: Swagger;
  snowflake?: SnowflakeConfig;
  jwt: JwtConfig;
  redis: RedisSingleOptions;
}
