import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';

import { Request, Response } from 'express';
type PrismaError = Error & {
  code?: string;
  meta?: { target?: string | string[] };
};

const isPrismaError = (
  exception: unknown,
  name: string,
): exception is PrismaError =>
  exception instanceof Error && exception.name === name;

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal Server Error';

    // 1. Unauthorized Exception
    if (exception instanceof UnauthorizedException) {
      status = HttpStatus.UNAUTHORIZED;

      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse
      ) {
        message = (exceptionResponse as any).message;
      }

      error = 'Unauthorized';
    }

    // 2. Other NestJS HTTP Exceptions
     
    else if (exception instanceof HttpException) {
      status = exception.getStatus();

      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const responseObject = exceptionResponse as any;

        message = responseObject.message ?? message;
        error = responseObject.error ?? error;
      }

      error = error || HttpStatus[status];
    }

  // 3. Prisma Known Request Errors
    
    else if (isPrismaError(exception, 'PrismaClientKnownRequestError')) {
      switch (exception.code) {
        // Unique constraint
        case 'P2002': {
          status = HttpStatus.CONFLICT;

          const target = exception.meta?.target;

          message = Array.isArray(target)
            ? `${target.join(', ')} already exists`
            : 'A record with this value already exists';

          error = 'Conflict';
          break;
        }

        // Record not found
        case 'P2025': {
          status = HttpStatus.NOT_FOUND;
          message = 'Record not found';
          error = 'Not Found';
          break;
        }

        // Foreign key constraint
        case 'P2003': {
          status = HttpStatus.BAD_REQUEST;
          message = 'Related record does not exist';
          error = 'Bad Request';
          break;
        }

        // Invalid field value
        case 'P2006': {
          status = HttpStatus.BAD_REQUEST;
          message = 'Invalid value provided';
          error = 'Bad Request';
          break;
        }

        // Required relation
        case 'P2014': {
          status = HttpStatus.BAD_REQUEST;
          message = 'Required relation violation';
          error = 'Bad Request';
          break;
        }

        default: {
          status = HttpStatus.INTERNAL_SERVER_ERROR;
          message = 'Database operation failed';
          error = 'Database Error';
        }
      }
    }

//  4. Prisma Validation Error
    
    else if (isPrismaError(exception, 'PrismaClientValidationError')) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Invalid data provided for database operation';
      error = 'Bad Request';
    }

  //  5. Prisma Initialization Error
     
    else if (isPrismaError(exception, 'PrismaClientInitializationError')) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Database connection failed';
      error = 'Database Error';
    }

    // 6. Generic Error
    
    else if (exception instanceof Error) {
      message = exception.message;
    }


      // Final Response
     

    response.status(status).json({
      statusCode: status,
      error,
      message,
      path: request.url,
      method: request.method,
      timestamp: new Date().toISOString(),
    });
  }
}