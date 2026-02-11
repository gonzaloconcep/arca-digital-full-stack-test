import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Company } from '../companies/company.entity';
import { PensionPlan } from '../pension-plans/pension-plan.entity';

export type OnboardingStatus =
  | 'not_started'
  | 'personal_info'
  | 'plan_selection'
  | 'completed';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @ManyToOne(() => Company, (company) => company.employees)
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  firstName: string | null;

  @Column({ type: 'varchar', nullable: true })
  lastName: string | null;

  @Column({ type: 'varchar', nullable: true })
  nif: string | null;

  @Column({ type: 'date', nullable: true })
  birthDate: Date | null;

  @Column({ type: 'varchar', nullable: true })
  pensionPlanId: string | null;

  @ManyToOne(() => PensionPlan, { nullable: true })
  @JoinColumn({ name: 'pensionPlanId' })
  pensionPlan: PensionPlan | null;

  @Column({
    type: 'varchar',
    default: 'not_started',
  })
  onboardingStatus: OnboardingStatus;

  @Column({ type: 'timestamp', nullable: true })
  onboardingCompletedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
