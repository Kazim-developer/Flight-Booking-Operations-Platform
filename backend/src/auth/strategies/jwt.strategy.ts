import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';

export type TravelerJwtPayload = {
  sub: string;
  userType: 'TRAVELER';
  role: 'TRAVELER';
  email: string;
};

export type AirlineUserJwtPayload = {
  sub: string;
  userType: 'AIRLINE_USER';
  role: 'ADMIN';
  email: string;
  airlineId: string;
};

export type AirlineStaffJwtPayload = {
  sub: string;
  userType: 'AIRLINE_STAFF';
  role: 'STAFF';
  email: string;
  airlineId: string;
};

export type JwtPayload =
  TravelerJwtPayload | AirlineUserJwtPayload | AirlineStaffJwtPayload;

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
