import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class OTP {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true, nullable: false })
  code: number;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ default: false, type: 'boolean', nullable: false })
  isRedeemed: boolean;
}
