import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('orders')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(AuthGuard('jwt:rider'))
  @Post()
  async create(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    return await this.orderService.create(createOrderDto, req.user.phone);
  }

  @UseGuards(AuthGuard('jwt:rider'))
  @Get('/rider')
  findAllRider() {
    return this.orderService.findAll();
  }

  @UseGuards(AuthGuard('jwt:driver'))
  @Get('/driver')
  findAllDriver() {
    return this.orderService.findAll();
  }

  @UseGuards(AuthGuard('jwt:rider'))
  @Get('/rider/:id')
  findOneRider(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt:driver'))
  @Get('/driver/:id')
  findOneDriver(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt:rider'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }
}
