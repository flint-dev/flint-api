import { IsNumber, IsString, IsUUID } from 'class-validator';

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
