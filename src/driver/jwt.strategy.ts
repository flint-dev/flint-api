import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt:driver') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: 'test-jwt-key',
    });
  }

  async validate(payload: {
    sub: { fullName: string; id: string };
    email: string;
  }) {
    return { sub: payload.sub, email: payload.email };
  }
}
