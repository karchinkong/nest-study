import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Logger,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const responseBody = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR',
      timestamp: new Date().toISOString(),
      path: request.url,
      success: false,
    };

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      responseBody.statusCode = exception.getStatus();

      if (typeof exceptionResponse === 'object') {
        const exceptionObj = exceptionResponse as {
          message: string | string[];
          error: string;
        };

        responseBody.message = Array.isArray(exceptionObj.message)
          ? exceptionObj.message.join(', ')
          : exceptionObj.message;
        responseBody.code = exceptionObj.error;
      } else {
        responseBody.message = exceptionResponse;
        responseBody.code = exception.name;
      }
    } else if (exception instanceof Error) {
      responseBody.code = exception.name;
    }

    // 记录错误日志
    this.logger.error(
      `[${request.method}] ${request.url} ${responseBody.statusCode} Code: ${responseBody.code} Message: ${responseBody.message}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    response.status(responseBody.statusCode).json(responseBody);
  }
}
