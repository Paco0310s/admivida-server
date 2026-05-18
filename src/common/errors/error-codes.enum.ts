export enum ErrorCode {
  // User & Auth Errors
  INVALID_EMAIL = 'INVALID_EMAIL',
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  USER_INACTIVE = 'USER_INACTIVE',

  // Token Errors
  INVALID_TOKEN = 'INVALID_TOKEN',
  EXPIRED_TOKEN = 'EXPIRED_TOKEN',
  MISSING_TOKEN = 'MISSING_TOKEN',
  REFRESH_TOKEN_EXPIRED = 'REFRESH_TOKEN_EXPIRED',

  // Validation Errors - User Fields
  FIRSTNAME_REQUIRED = 'FIRSTNAME_REQUIRED',
  FIRSTNAME_TOO_LONG = 'FIRSTNAME_TOO_LONG',
  LASTNAME_REQUIRED = 'LASTNAME_REQUIRED',
  LASTNAME_TOO_LONG = 'LASTNAME_TOO_LONG',
  PHONE_INVALID = 'PHONE_INVALID',
  PHONE_REQUIRED = 'PHONE_REQUIRED',
  PASSWORD_TOO_SHORT = 'PASSWORD_TOO_SHORT',
  PASSWORD_REQUIRED = 'PASSWORD_REQUIRED',
  EMAIL_REQUIRED = 'EMAIL_REQUIRED',
  REFRESH_TOKEN_REQUIRED = 'REFRESH_TOKEN_REQUIRED',
  REFRESH_TOKEN_INVALID = 'REFRESH_TOKEN_INVALID',
  IS_ACTIVE_INVALID = 'IS_ACTIVE_INVALID',

  // General Validation Errors
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  INVALID_REQUEST_BODY = 'INVALID_REQUEST_BODY',

  // General Errors
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  CONFLICT = 'CONFLICT',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
}

export const ErrorMessages: Record<ErrorCode, string> = {
  [ErrorCode.INVALID_EMAIL]: 'The email format is invalid',
  [ErrorCode.EMAIL_ALREADY_EXISTS]: 'Email is already registered',
  [ErrorCode.INVALID_CREDENTIALS]: 'Invalid email or password',
  [ErrorCode.USER_NOT_FOUND]: 'User not found',
  [ErrorCode.USER_INACTIVE]: 'User account is inactive',

  [ErrorCode.INVALID_TOKEN]: 'The provided token is invalid',
  [ErrorCode.EXPIRED_TOKEN]: 'The token has expired',
  [ErrorCode.MISSING_TOKEN]: 'Authentication token is missing',
  [ErrorCode.REFRESH_TOKEN_EXPIRED]: 'Refresh token has expired',

  [ErrorCode.FIRSTNAME_REQUIRED]: 'First name is required',
  [ErrorCode.FIRSTNAME_TOO_LONG]: 'First name cannot exceed 100 characters',
  [ErrorCode.LASTNAME_REQUIRED]: 'Last name is required',
  [ErrorCode.LASTNAME_TOO_LONG]: 'Last name cannot exceed 100 characters',
  [ErrorCode.PHONE_INVALID]: 'Invalid phone number format',
  [ErrorCode.PHONE_REQUIRED]: 'Phone number is required',
  [ErrorCode.PASSWORD_TOO_SHORT]: 'Password must be at least 8 characters',
  [ErrorCode.PASSWORD_REQUIRED]: 'Password is required',
  [ErrorCode.EMAIL_REQUIRED]: 'Email is required',
  [ErrorCode.REFRESH_TOKEN_REQUIRED]: 'Refresh token is required',
  [ErrorCode.REFRESH_TOKEN_INVALID]: 'Refresh token is invalid or not a string',
  [ErrorCode.IS_ACTIVE_INVALID]: 'isActive must be a boolean',

  [ErrorCode.VALIDATION_FAILED]: 'Validation failed',
  [ErrorCode.INVALID_REQUEST_BODY]: 'Invalid request body',

  [ErrorCode.RESOURCE_NOT_FOUND]: 'Resource not found',
  [ErrorCode.CONFLICT]: 'Conflict occurred',
  [ErrorCode.INTERNAL_SERVER_ERROR]: 'Internal server error',
  [ErrorCode.UNAUTHORIZED]: 'Unauthorized access',
  [ErrorCode.FORBIDDEN]: 'Forbidden access',
};
