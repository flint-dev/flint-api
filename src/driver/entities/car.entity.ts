import { Order } from '../../rider/entities/order.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Driver } from './driver.entity';

@Entity()
export class Car {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: string;

  @Column({ nullable: true })
  latitude: number;

  @Column({ nullable: true })
  longitude: number;

  @Column({ nullable: true })
  heading: number;

  @OneToMany(() => Order, (order: Order) => order.car, { cascade: true })
  orders: Order[];

  @OneToOne(() => Driver, (driver: Driver) => driver.car, { cascade: true })
  driver: Driver;
}
