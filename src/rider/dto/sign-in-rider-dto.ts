import { IsNotEmpty, IsString } from 'class-validator';

export class SignInRiderDto {
  @IsNotEmpty()
  otp: string;

  @IsString()
  phone: string;
}
