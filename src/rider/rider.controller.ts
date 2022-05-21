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
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RiderService } from './rider.service';
import { CreateRiderDto } from './dto/create-rider.dto';
import { SendOTPDto } from './dto/send-otp.dto';
import { UpdateRiderDto } from './dto/update-rider.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiAcceptedResponse,
  ApiBody,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Rider } from './entities/rider.entity';

@ApiTags('riders')
@Controller('riders')
export class RiderController {
  constructor(private readonly riderService: RiderService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Created',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
        },
      },
      required: ['access_token'],
    },
  })
  create(@Body() createRiderDto: CreateRiderDto) {
    return this.riderService.create(createRiderDto);
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        phone: {
          type: 'string',
          // eslint-disable-next-line prettier/prettier
          pattern: '^+[]{0,1}[0-9]{1,4}[]{0,1}[s./0-9]*$',
        },
        otp: {
          type: 'number',
        },
      },
      required: ['phone', 'otp'],
    },
  })
  @UseGuards(AuthGuard('otp'))
  @Post('auth/login')
  @ApiResponse({
    status: 200,
    description: 'Accepted',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
        },
      },
      required: ['access_token'],
    },
  })
  login(@Request() req) {
    return this.riderService.signIn(req.user);
  }

  @Post('/otp')
  @ApiAcceptedResponse()
  async sendOTP(@Body() sendOTP: SendOTPDto) {
    return this.riderService.sendOTP(sendOTP);
  }

  @UseGuards(AuthGuard('jwt:rider'))
  @Get()
  findAll() {
    return this.riderService.findAll();
  }

  @UseGuards(AuthGuard('jwt:rider'))
  @ApiResponse({ type: Rider })
  @Get('profile')
  getRiderProfile(@Request() req) {
    return this.riderService.findOne(req.user.phone);
  }

  @ApiResponse({ type: Rider })
  @UseGuards(AuthGuard('jwt:rider'))
  @Get(':phone')
  async findOne(@Param('phone') phone: string) {
    const rider = await this.riderService.findOne(phone);
    if (rider) return rider;
    throw new HttpException('Rider not found', HttpStatus.NOT_FOUND);
  }

  @UseGuards(AuthGuard('jwt:rider'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRiderDto: UpdateRiderDto) {
    return this.riderService.update(+id, updateRiderDto);
  }

  @UseGuards(AuthGuard('jwt:rider'))
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.riderService.remove(id);
  }
}
