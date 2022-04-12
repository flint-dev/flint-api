import { Car } from '../../driver/entities/car.entity';
import { Rider } from '../../rider/entities/rider.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: string;

  @Column({ default: -0.180712, type: 'decimal' })
  originLatitude: number;

  @Column({ default: 5.638829, type: 'decimal' })
  originLongitude: number;

  @Column({ default: -0.18071, type: 'decimal' })
  destinationLatitude: number;

  @Column({ default: 5.6388289, type: 'decimal' })
  destinationLongitude: number;

  @ManyToOne(() => Car)
  car: Car;

  @ManyToOne(() => Rider)
  rider: Rider;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
