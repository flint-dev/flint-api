import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Rider {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ default: false })
  isActive: boolean;
}
