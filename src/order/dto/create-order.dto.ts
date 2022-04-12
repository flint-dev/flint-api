import { IsDecimal, IsEnum, IsNumber, IsString, IsUUID } from 'class-validator';

class OrderTypes {
  TYPE_1 = 'TYPE_1';
  TYPE_2 = 'TYPE_2';
}

export class CreateOrderDto {
  @IsString()
  type: string;

  @IsNumber()
  originLatitude: number;

  @IsNumber()
  originLongitude: number;

  @IsNumber()
  destinationLatitude: number;

  @IsNumber()
  destinationLongitude: number;

  @IsUUID()
  carId: string;
}
