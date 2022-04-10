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
import { Order } from './rider/entities/order.entity';
import { Car } from './driver/entities/car.entity';

@Module({
  imports: [
    RiderModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      database: 'test',
      entities: [Rider, OTP, Driver, Order, Car],
      synchronize: true,
    }),
    DriverModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
