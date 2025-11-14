import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './jwt.guard';

export const appGuards = [
  {
    provide: APP_GUARD,
    useClass: JwtGuard,
  },
];
