import { Order } from '../../order/entities/order.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Driver } from './driver.entity';

@Entity()
export class Car {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: string;

  @Column({ default: -0.1807155, type: 'decimal' })
  latitude: number;

  @Column({ default: 5.6388291, type: 'decimal' })
  longitude: number;

  @Column({ default: 5 })
  heading: number;

  @OneToMany(() => Order, (order: Order) => order.car)
  orders?: Order[];

  @OneToOne(() => Driver, (driver: Driver) => driver.car)
  @JoinColumn({ name: 'driverId' })
  driver: Driver;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
