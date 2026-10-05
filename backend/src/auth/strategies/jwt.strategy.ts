import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';

export interface JwtPayload {
  sub: string;
  role: string;
  email?: string;
  accountType?: 'AIRLINE_USER' | 'AIRLINE_STAFF';
  airlineId?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request.cookies?.access_token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  validate(payload: JwtPayload): JwtPayload {
    return payload;
  }
}
