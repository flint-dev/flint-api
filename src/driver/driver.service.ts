import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { Driver } from './entities/driver.entity';

@Injectable()
export class DriverService {
  constructor(
    @InjectRepository(Driver) private driversRepository: Repository<Driver>,
    private jwtService: JwtService,
  ) {}
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.findOne(username);
    if (!user)
      throw new HttpException(
        `Driver with email ${username} not found`,
        HttpStatus.NOT_FOUND,
      );
    if (user && bcrypt.compare(pass, user.password)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: Driver) {
    const payload = {
      username: user.email,
      sub: {
        fullName: user.fullName,
        id: user.id,
      },
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async create(createDriverDto: CreateDriverDto) {
    if (createDriverDto.password !== createDriverDto.confirmPassword)
      throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);
    createDriverDto.password = await bcrypt.hash(createDriverDto.password, 8);
    const existingUser = await this.findOne(createDriverDto.email);
    if (existingUser)
      throw new HttpException('User already Exist', HttpStatus.CONFLICT);
    const user = this.driversRepository.create(createDriverDto);
    await this.driversRepository.save(user);
    return this.validateUser(user.email, createDriverDto.confirmPassword);
  }

  findAll() {
    return `This action returns all driver`;
  }

  findOne(email: string) {
    return this.driversRepository.findOne({ where: { email } });
  }

  update(id: number, updateDriverDto: UpdateDriverDto) {
    return `This action updates a #${id} driver`;
  }

  remove(id: number) {
    return `This action removes a #${id} driver`;
  }
}
