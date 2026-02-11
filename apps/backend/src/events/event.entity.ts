import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Employee } from '../employees/employee.entity';

export type EventType =
  | 'onboarding_started'
  | 'onboarding_step_personal_info'
  | 'onboarding_step_plan_selection'
  | 'onboarding_completed'
  | 'plan_viewed'
  | 'plan_selected';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  type: EventType;

  @Column({ nullable: true })
  employeeId: string | null;

  @ManyToOne(() => Employee, { nullable: true })
  @JoinColumn({ name: 'employeeId' })
  employee: Employee | null;

  @Column()
  sessionId: string;

  @Column({ type: 'jsonb', default: {} })
  payload: Record<string, unknown>;

  @CreateDateColumn()
  timestamp: Date;
}
