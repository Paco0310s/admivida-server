import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode, ErrorMessages } from '../errors/error-codes.enum';

export class CustomHttpException extends HttpException {
  constructor(
    errorCode: ErrorCode,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
    customMessage?: string,
  ) {
    const message = customMessage || ErrorMessages[errorCode];
    super({ errorCode, message }, statusCode);
  }
}

// Convenience classes for common errors
export class ConflictEmailException extends CustomHttpException {
  constructor(customMessage?: string) {
    super(ErrorCode.EMAIL_ALREADY_EXISTS, HttpStatus.CONFLICT, customMessage);
  }
}

export class InvalidCredentialsException extends CustomHttpException {
  constructor(customMessage?: string) {
    super(
      ErrorCode.INVALID_CREDENTIALS,
      HttpStatus.UNAUTHORIZED,
      customMessage,
    );
  }
}

export class InvalidTokenException extends CustomHttpException {
  constructor(customMessage?: string) {
    super(ErrorCode.INVALID_TOKEN, HttpStatus.UNAUTHORIZED, customMessage);
  }
}

export class ExpiredTokenException extends CustomHttpException {
  constructor(customMessage?: string) {
    super(ErrorCode.EXPIRED_TOKEN, HttpStatus.UNAUTHORIZED, customMessage);
  }
}

export class UserNotFoundException extends CustomHttpException {
  constructor(customMessage?: string) {
    super(ErrorCode.USER_NOT_FOUND, HttpStatus.NOT_FOUND, customMessage);
  }
}

export class UserInactiveException extends CustomHttpException {
  constructor(customMessage?: string) {
    super(ErrorCode.USER_INACTIVE, HttpStatus.FORBIDDEN, customMessage);
  }
}

export class RefreshTokenExpiredException extends CustomHttpException {
  constructor(customMessage?: string) {
    super(
      ErrorCode.REFRESH_TOKEN_EXPIRED,
      HttpStatus.UNAUTHORIZED,
      customMessage,
    );
  }
}
