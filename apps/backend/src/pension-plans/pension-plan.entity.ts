import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type RiskLevel = 'conservative' | 'balanced' | 'dynamic';

@Entity('pension_plans')
export class PensionPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column({ type: 'varchar' })
  riskLevel: RiskLevel;

  @Column({ type: 'decimal', precision: 4, scale: 2 })
  expectedReturnMin: number;

  @Column({ type: 'decimal', precision: 4, scale: 2 })
  expectedReturnMax: number;

  @Column({ type: 'decimal', precision: 4, scale: 2 })
  managementFee: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
