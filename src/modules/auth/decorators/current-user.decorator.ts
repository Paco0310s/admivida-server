import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export interface CurrentUserData {
  userId: string;
  email: string;
  token: string;
  role: string;
}

// Extiende Express Request para incluir nuestras propiedades personalizadas
declare global {
  namespace Express {
    interface User {
      userId: string;
      email: string;
      token: string;
      role: string;
    }
  }
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CurrentUserData => {
    const request = ctx.switchToHttp().getRequest<Request>();
    
    // Extraer el token del header
    const authHeader = request.headers.authorization;
    const token = authHeader?.replace('Bearer ', '') || '';

    return {
      userId: request.user?.userId || '',
      email: request.user?.email || '',
        role: request.user?.role || 'USER',
      token,
    };
  },
);
