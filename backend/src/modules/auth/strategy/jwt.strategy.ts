import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';

interface JwtPayload {
  sub: string;
  email: string;
  role?: string;
  permissions: string[];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey:
        process.env.JWT_SECRET ?? 'cafdata-development-secret-change-me',
    });
  }

  validate(payload: JwtPayload) {
    return payload;
  }
}
