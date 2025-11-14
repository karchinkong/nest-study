import { INestApplication } from '@nestjs/common';
import cookieParser from 'cookie-parser';

export const useMiddleware = (app: INestApplication) => {
  app.use(cookieParser());
};
