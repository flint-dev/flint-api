import { IsNotEmpty, IsEmail, IsPhoneNumber, IsEnum } from 'class-validator';

class CarTypes {
  TYPE_1 = 'TYPE_1';
  TYPE_2 = 'TYPE_2';
}

export class CreateDriverDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phone: string;

  @IsNotEmpty()
  password: string;

  @IsEnum(CarTypes)
  carType: string;

  @IsNotEmpty()
  confirmPassword: string;
}
