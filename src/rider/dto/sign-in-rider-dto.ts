import { IsNotEmpty, IsEmail, IsPhoneNumber } from 'class-validator';

export class SignInRiderDto {
  @IsNotEmpty()
  otp: string;

  @IsPhoneNumber()
  phone: string;

  @IsEmail()
  email: string;
}
