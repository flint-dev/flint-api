import { Module } from '@nestjs/common';
import { DriverService } from './driver.service';
import { DriverController } from './driver.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Driver } from './entities/driver.entity';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { Car } from './entities/car.entity';

@Module({
  controllers: [DriverController],
  providers: [DriverService, LocalStrategy, JwtStrategy],
  imports: [
    TypeOrmModule.forFeature([Driver, Car]),
    PassportModule,
    JwtModule.register({
      secret: 'jwtConstants.secret',
    }),
  ],
  exports: [TypeOrmModule],
})
export class DriverModule {}
