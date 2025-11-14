import { INestApplication } from '@nestjs/common';
import { GlobalExceptionFilter } from './global-exception.filter';

export const useFilters = (app: INestApplication) => {
  app.useGlobalFilters(new GlobalExceptionFilter());
};
