import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { Order } from './entities/order.entity';
import { JwtStrategy as DriverJwt } from '../driver/jwt.strategy';
import { JwtStrategy as RiderJwt } from '../rider/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { RiderModule } from '../rider/rider.module';
import { DriverModule } from '../driver/driver.module';

@Module({
  controllers: [OrderController],
  imports: [
    TypeOrmModule.forFeature([Order]),
    PassportModule,
    JwtModule.register({
      secret: 'test-jwt-key',
    }),
    RiderModule,
    DriverModule,
  ],
  exports: [TypeOrmModule],
  providers: [OrderService, RiderJwt, DriverJwt],
})
export class OrderModule {}
