import { Module } from '@nestjs/common';
import { RiderService } from './rider.service';
import { RiderController } from './rider.controller';
import { OTP } from './entities/otp.entity';
import { Rider } from './entities/rider.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  controllers: [RiderController],
  imports: [
    TypeOrmModule.forFeature([Rider, OTP, Rider]),
    PassportModule,
    JwtModule.register({
      secret: 'jwtConst',
    }),
  ],
  exports: [TypeOrmModule],
  providers: [RiderService, LocalStrategy, JwtStrategy],
})
export class RiderModule {}
