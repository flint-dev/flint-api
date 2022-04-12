import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { RiderService } from '../rider/rider.service';
import { DriverService } from '../driver/driver.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private ordersRepository: Repository<Order>,
    private readonly riderService: RiderService,
    private readonly driverService: DriverService,
  ) {}

  async create(createOrderDto: CreateOrderDto, riderPhone: string) {
    const order: Order = this.ordersRepository.create(createOrderDto);
    order.rider = await this.riderService.findOne(riderPhone);
    order.car = await this.driverService.findOneCar(createOrderDto.carId);
    await this.ordersRepository.save(order);
    return order;
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: string) {
    return `This action returns a #${id} order`;
  }

  update(id: string, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
