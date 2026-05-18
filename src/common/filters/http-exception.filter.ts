import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorCode, ErrorMessages } from '../errors/error-codes.enum';

interface ErrorResponse {
  statusCode: number;
  errorCode: ErrorCode;
  message: string;
  timestamp: string;
  path: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode = ErrorCode.INTERNAL_SERVER_ERROR;
    let message = ErrorMessages[ErrorCode.INTERNAL_SERVER_ERROR];

    // Handle HttpException
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse() as any;

      // If it's a custom exception with errorCode
      if (exceptionResponse.errorCode) {
        errorCode = exceptionResponse.errorCode;
        message = exceptionResponse.message || ErrorMessages[errorCode];
      } else {
        // Map standard HTTP exceptions to error codes
        if (exception instanceof BadRequestException) {
          // Handle validation errors from class-validator
          if (
            exceptionResponse.message &&
            Array.isArray(exceptionResponse.message)
          ) {
            const errors = exceptionResponse.message as any[];
            if (errors.length > 0) {
              // Extract the error code from the first constraint (message field)
              const firstError = errors[0];
              const constraints = firstError.constraints || {};
              const errorMessages = Object.values(constraints) as string[];
              
              // The error code is in the first constraint message
              if (errorMessages.length > 0) {
                const potentialErrorCode = errorMessages[0];
                // Check if it's a valid error code
                if (Object.values(ErrorCode).includes(potentialErrorCode as ErrorCode)) {
                  errorCode = potentialErrorCode as ErrorCode;
                  message = ErrorMessages[errorCode];
                } else {
                  errorCode = ErrorCode.VALIDATION_FAILED;
                  message = errorMessages.join('; ');
                }
              }
            }
          } else {
            errorCode = ErrorCode.INVALID_REQUEST_BODY;
            message = ErrorMessages[ErrorCode.INVALID_REQUEST_BODY];
          }
        } else if (exception instanceof UnauthorizedException) {
          errorCode = ErrorCode.UNAUTHORIZED;
          message = ErrorMessages[ErrorCode.UNAUTHORIZED];
        } else if (exception instanceof ForbiddenException) {
          errorCode = ErrorCode.FORBIDDEN;
          message = ErrorMessages[ErrorCode.FORBIDDEN];
        } else if (exception instanceof NotFoundException) {
          errorCode = ErrorCode.RESOURCE_NOT_FOUND;
          message = ErrorMessages[ErrorCode.RESOURCE_NOT_FOUND];
        } else if (exception instanceof ConflictException) {
          errorCode = ErrorCode.CONFLICT;
          message = ErrorMessages[ErrorCode.CONFLICT];
        } else {
          message = exceptionResponse.message || message;
        }
      }
    } else if (exception instanceof Error) {
      this.logger.error(
        `Unhandled error: ${exception.message}`,
        exception.stack,
      );
    }

    const errorResponse: ErrorResponse = {
      statusCode,
      errorCode,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(statusCode).json(errorResponse);
  }
}
