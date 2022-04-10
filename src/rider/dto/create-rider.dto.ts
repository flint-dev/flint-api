import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class CreateRiderDto {
  @IsNotEmpty()
  otp: string;

  @IsString()
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  name: string;
}
