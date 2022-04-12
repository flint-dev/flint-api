import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { CreateRiderDto } from './dto/create-rider.dto';
import { SendOTPDto } from './dto/send-otp.dto';
import { UpdateRiderDto } from './dto/update-rider.dto';
import { OTP } from './entities/otp.entity';
import { Rider } from './entities/rider.entity';
import sendChatdaddy from './utils/send-chatdaddy';
import { Message } from '@chatdaddy/service-im-client';

@Injectable()
export class RiderService {
  constructor(
    @InjectRepository(Rider) private ridersRepository: Repository<Rider>,
    @InjectRepository(OTP) private otpsRepository: Repository<OTP>,
    private jwtService: JwtService,
  ) {}
  async create(createRiderDto: CreateRiderDto): Promise<{
    access_token: string;
  }> {
    const otp = await this.otpsRepository.findOne({
      where: { phone: createRiderDto.phone, code: createRiderDto.otp },
    });
    if (!otp) throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
    const userExists = await this.findOne(createRiderDto.phone);
    if (userExists)
      throw new HttpException(
        'User Already Exists, Please Login',
        HttpStatus.CONFLICT,
      );
    const user = this.ridersRepository.create(createRiderDto);
    otp.isRedeemed = true;
    user.isActive = true;
    await Promise.all([
      this.otpsRepository.save(otp),
      this.ridersRepository.save(user),
    ]);
    return this.signIn(user);
  }

  async validate(username: string, code: number) {
    const otp = await this.otpsRepository.findOne({
      where: { code },
    });
    const user = await this.findOne(username);
    if (!otp) throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
    if (otp.phone !== username) return null;
    if (otp.isRedeemed)
      throw new HttpException(
        'OTP has already been used',
        HttpStatus.BAD_REQUEST,
      );

    otp.isRedeemed = true;
    this.otpsRepository.save(otp);
    return {
      user,
      otp,
    };
  }

  async signIn(rider: Rider): Promise<{
    access_token: string;
  }> {
    const payload = { phone: rider.phone, sub: rider };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async sendOTP(sendOTPDto: SendOTPDto) {
    let code = Math.floor(Math.random() * 100000);
    while (await this.otpsRepository.findOne({ where: { code } })) {
      code = Math.floor(Math.random() * 100000);
    }

    let res: Message;
    switch (sendOTPDto.type) {
      case 'WHATSAPP':
        const message = `Your Flint code is ${code}`;

        try {
          res = await sendChatdaddy(sendOTPDto.phone, message);
        } catch (error) {
          throw new Error(error);
        }
        break;

      case 'SMS':
        throw new HttpException(
          'SMS Verification Not Implemented yet',
          HttpStatus.NOT_IMPLEMENTED,
        );
      case 'EMAIL':
        throw new HttpException(
          'EMAIL Verification Not Implemented yet',
          HttpStatus.NOT_IMPLEMENTED,
        );
      default:
        break;
    }
    if (!res)
      throw new HttpException(
        `Could not send OTP to ${sendOTPDto.phone}`,
        HttpStatus.EXPECTATION_FAILED,
      );
    const existingOTP = await this.otpsRepository.findOne({
      where: { phone: sendOTPDto?.phone },
    });

    if (existingOTP) this.otpsRepository.delete(existingOTP.id);
    const otp = this.otpsRepository.create({
      code,
      phone: sendOTPDto.phone,
    });
    await this.otpsRepository.save(otp);
    return;
  }

  findAll() {
    return `This action returns all rider`;
  }

  async findOne(phone: string): Promise<Rider> {
    return await this.ridersRepository.findOne({
      where: { phone },
    });
  }

  update(id: number, updateRiderDto: UpdateRiderDto) {
    return `This action updates a #${id} rider, data: ${updateRiderDto}`;
  }

  remove(id: number) {
    return `This action removes a #${id} rider`;
  }
}
