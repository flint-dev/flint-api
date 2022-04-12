import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Rider } from './entities/rider.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt:rider') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: 'test-jwt-key',
    });
  }

  async validate(payload: { sub: Rider; phone: string }) {
    return { userId: payload.sub.id, phone: payload.phone };
  }
}
