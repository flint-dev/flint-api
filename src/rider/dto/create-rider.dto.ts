import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsOptional,
} from 'class-validator';

export class CreateRiderDto {
  @IsNotEmpty()
  otp: string;

  @IsPhoneNumber()
  phone: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  name: string;
}
