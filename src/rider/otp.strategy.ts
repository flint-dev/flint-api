import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RiderService } from './rider.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'otp') {
  constructor(private riderService: RiderService) {
    super({
      usernameField: 'phone',
      passwordField: 'otp',
    });
  }

  async validate(username: string, password: string): Promise<any> {
    const { otp, user } = await this.riderService.validate(
      username,
      parseInt(password),
    );
    if (otp.code != parseInt(password)) {
      throw new UnauthorizedException(password);
    }
    return user;
  }
}
