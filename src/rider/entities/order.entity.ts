import { Car } from '../../driver/entities/car.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Rider } from './rider.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: string;

  @ManyToOne(() => Car, (car: Car) => car.orders, { cascade: true })
  car: Car;

  @ManyToOne(() => Rider, (rider: Rider) => rider.orders, { cascade: true })
  rider: Rider;
}
