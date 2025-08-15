import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { StaffLeave } from './staff-leave.entity';
import { StaffLeaveBalance } from './staff-leave-balance.entity';

@Entity('leave_types')
export class LeaveType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int', default: 0 })
  default_days: number;

  @Column({ type: 'tinyint', default: 1 })
  is_active: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  // Relations
  @OneToMany(() => StaffLeave, leave => leave.leave_type)
  leaves: StaffLeave[];

  @OneToMany(() => StaffLeaveBalance, balance => balance.leave_type)
  leave_balances: StaffLeaveBalance[];
} 