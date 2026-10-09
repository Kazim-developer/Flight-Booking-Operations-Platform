import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';

import type { Request } from 'express';
import type { JwtPayload } from '../strategies/jwt.strategy';

interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

@Injectable()
export class AirlineAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const user = request.user;

    if (
      !user ||
      user.userType !== 'AIRLINE_USER' ||
      user.role !== 'ADMIN' ||
      !user.airlineId
    ) {
      throw new ForbiddenException(
        'Only airline administrators can perform this action',
      );
    }

    return true;
  }
}
