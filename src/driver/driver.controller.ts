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
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DriverService } from './driver.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { Driver } from './entities/driver.entity';

@ApiTags('drivers')
@Controller('drivers')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          format: 'email',
        },
        password: {
          type: 'string',
        },
      },
      required: ['email', 'password'],
    },
  })
  @UseGuards(AuthGuard('local'))
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
  async login(@Request() req): Promise<{ access_token: string }> {
    return this.driverService.login(req.user);
  }

  @UseGuards(AuthGuard('jwt:driver'))
  @ApiResponse({ type: Driver })
  @Get('profile')
  getProfile(@Request() req) {
    return this.driverService.findOne(req.user.email);
  }

  @Post()
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
  @ApiBody({ type: CreateDriverDto })
  create(@Body() createDriverDto: CreateDriverDto & { salt: string }) {
    return this.driverService.create(createDriverDto);
  }

  @Get()
  findAll() {
    return this.driverService.findAll();
  }

  @ApiResponse({ type: Driver })
  @Get(':email')
  findOne(@Param('email') email: string) {
    return this.driverService.findOne(email);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDriverDto: UpdateDriverDto) {
    return this.driverService.update(+id, updateDriverDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.driverService.remove(+id);
  }
}
