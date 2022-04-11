import { Exclude, Expose } from 'class-transformer';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Car } from './car.entity';

@Entity()
export class Driver {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phone: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  @Exclude()
  salt: string;

  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  @Column({ default: true })
  isActive: boolean;

  @OneToOne(() => Car, (car: Car) => car.driver, { cascade: true })
  car: Car;
}
