import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_name', type: 'varchar' })
  userName: string;

  @Column({ nullable: true, type: 'varchar' })
  email: string;

  @Index()
  @Column({ unique: true, type: 'varchar', name: 'wallet_address' })
  walletAddress: string;

  @Column({ default: 0 })
  points: number;

  @Column({ default: false, name: 'is_og' })
  isOg: boolean;
}
