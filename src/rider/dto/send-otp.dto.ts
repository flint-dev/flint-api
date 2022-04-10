import { IsEmail, IsNotEmpty, IsEnum, IsString } from 'class-validator';

export enum OTPType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  WHATSAPP = 'WHATSAPP',
}

export class SendOTPDto {
  @IsEnum(OTPType)
  @IsNotEmpty()
  type: string;

  @IsString()
  phone: string;

  @IsEmail()
  email: string;
}
