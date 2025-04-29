import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  UnauthorizedException,
  ForbiddenException as ForbiddenExceptionNest,
} from '@nestjs/common';
import { Response } from 'express';
import {
  BadRequestException,
  NotFoundException,
  UnknownErrorException,
} from './errors';

const getErrorData = (error: any) => {
  return {
    status: error.status,
    message: error.message,
    code: error.code,
  };
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof ForbiddenExceptionNest) {
      response.status(HttpStatus.FORBIDDEN).json(getErrorData(exception));
    } else if (exception instanceof NotFoundException) {
      response.status(HttpStatus.NOT_FOUND).json(getErrorData(exception));
    } else if (exception instanceof BadRequestException) {
      response.status(HttpStatus.BAD_REQUEST).json(getErrorData(exception));
    } else if (exception instanceof UnauthorizedException) {
      response.status(HttpStatus.UNAUTHORIZED).json(getErrorData(exception));
    } else if (exception instanceof UnknownErrorException) {
      response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(getErrorData(exception));
    } else {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal Server Error',
        ...(exception || {}),
      });
    }
  }
}
