import { IsEmail, IsNotEmpty, IsEnum, IsPhoneNumber } from 'class-validator';

export enum OTPType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  WHATSAPP = 'WHATSAPP',
}

export class SendOTPDto {
  @IsEnum(OTPType)
  @IsNotEmpty()
  type: string;

  @IsPhoneNumber()
  phone: string;

  @IsEmail()
  email: string;
}
