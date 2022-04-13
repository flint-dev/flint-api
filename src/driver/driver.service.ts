import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes, pbkdf2Sync } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { Driver } from './entities/driver.entity';
import { Car } from './entities/car.entity';

@Injectable()
export class DriverService {
  constructor(
    @InjectRepository(Driver) private driversRepository: Repository<Driver>,
    @InjectRepository(Car) private carsRepository: Repository<Car>,
    private jwtService: JwtService,
  ) {}
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this._findOne(username);
    if (!user)
      throw new HttpException(
        `Driver with email ${username} not found`,
        HttpStatus.NOT_FOUND,
      );
    const newHash = pbkdf2Sync(pass, user.salt, 1000, 64, 'sha256').toString(
      'hex',
    );
    if (user && newHash === user.password) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, salt, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: Driver): Promise<{ access_token: string }> {
    const payload = {
      email: user.email,
      sub: {
        fullName: user.fullName,
        id: user.id,
      },
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async create(
    createDriverDto: CreateDriverDto & { salt: string },
  ): Promise<{ access_token: string }> {
    if (createDriverDto.password !== createDriverDto.confirmPassword)
      throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);
    createDriverDto.salt = randomBytes(16).toString('hex');
    createDriverDto.password = pbkdf2Sync(
      createDriverDto.password,
      createDriverDto.salt,
      1000,
      64,
      'sha256',
    ).toString('hex');
    const existingUser = await this._findOne(createDriverDto.email);
    if (existingUser)
      throw new HttpException('User already Exist', HttpStatus.CONFLICT);
    const user = this.driversRepository.create(createDriverDto);
    await this.driversRepository.save(user);
    // Create Car for Driver
    const car = this.carsRepository.create({
      type: createDriverDto.carType,
      driver: user,
    });
    await this.carsRepository.save(car);
    return this.login(user);
  }

  findAll() {
    return `This action returns all driver`;
  }

  async findOne(email: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { salt, password, ...result } =
        await this.driversRepository.findOneOrFail({
          where: { email },
        });
      return result;
    } catch (error) {
      throw new HttpException(
        `Driver with email [${email}] not found`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async findOneCar(carId: string) {
    return await this.carsRepository.findOne({
      where: { id: carId },
    });
  }

  private _findOne(email: string) {
    return this.driversRepository.findOne({ where: { email } });
  }

  update(id: number, updateDriverDto: UpdateDriverDto) {
    return `This action updates a #${id}, ${updateDriverDto} driver`;
  }

  remove(id: number) {
    return `This action removes a #${id} driver`;
  }
}
