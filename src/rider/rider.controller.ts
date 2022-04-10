import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { RiderService } from './rider.service';
import { CreateRiderDto } from './dto/create-rider.dto';
import { SendOTPDto } from './dto/send-otp.dto';
import { UpdateRiderDto } from './dto/update-rider.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

@ApiTags('riders')
@Controller('riders')
export class RiderController {
  constructor(private readonly riderService: RiderService) {}

  @Post()
  create(@Body() createRiderDto: CreateRiderDto) {
    return this.riderService.create(createRiderDto);
  }

  @UseGuards(AuthGuard('local'))
  @Post('/auth/login')
  login(@Request() req) {
    return this.riderService.signIn(req.user);
  }

  @Post('/otp')
  sendOTP(@Body() sendOTP: SendOTPDto) {
    return this.riderService.sendOTP(sendOTP);
  }

  @Get()
  findAll() {
    return this.riderService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getRiderProfile(@Request() req) {
    return this.riderService.findOne(req.user.phone);
  }

  @Get('phone')
  findOne(@Param('phone') phone: string) {
    return this.riderService.findOne(phone);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRiderDto: UpdateRiderDto) {
    return this.riderService.update(+id, updateRiderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.riderService.remove(+id);
  }
}
