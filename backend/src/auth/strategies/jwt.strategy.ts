import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';

export type JwtPayload =
  | {
      sub: string;
      userType: 'TRAVELER';
      role: 'TRAVELER';
      email: string;
    }
  | {
      sub: string;
      userType: 'AIRLINE_USER';
      role: 'ADMIN';
      email: string;
      airlineId: string;
    }
  | {
      sub: string;
      userType: 'AIRLINE_STAFF';
      role: 'STAFF';
      email: string;
      airlineId: string;
    };

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
