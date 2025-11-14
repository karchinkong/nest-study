import { HttpException, HttpStatus } from '@nestjs/common';

export interface ExceptionInfo {
  message: string;
  status: HttpStatus;
  code?: string;
}

export class BaseException extends HttpException {
  constructor(info: ExceptionInfo) {
    super(
      { message: info.message, status: info.status, code: info.code },
      info.status,
    );
  }
}
