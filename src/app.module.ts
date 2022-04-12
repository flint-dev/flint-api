import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OTP } from './rider/entities/otp.entity';
import { Rider } from './rider/entities/rider.entity';
import { RiderModule } from './rider/rider.module';
import { DriverModule } from './driver/driver.module';
import { Driver } from './driver/entities/driver.entity';
import { Order } from './order/entities/order.entity';
import { Car } from './driver/entities/car.entity';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    RiderModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'flint-1.cfdzyhfkuvzq.eu-west-2.rds.amazonaws.com',
      port: 5432,
      username: 'postgres',
      password: '71dSR8k5NhjS2RGBJlyT',
      database: 'test',
      entities: [Rider, OTP, Driver, Order, Car],
      synchronize: true,
    }),
    DriverModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
