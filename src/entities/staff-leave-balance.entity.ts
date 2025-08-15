import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Staff } from './staff.entity';
import { LeaveType } from './leave-type.entity';

@Entity('staff_leave_balances')
export class StaffLeaveBalance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  staff_id: number;

  @Column({ type: 'int' })
  leave_type_id: number;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.00 })
  accrued: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.00 })
  used: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.00 })
  carried_forward: number;

  // Relations
  @ManyToOne(() => Staff, staff => staff.leave_balances)
  @JoinColumn({ name: 'staff_id' })
  staff: Staff;

  @ManyToOne(() => LeaveType, leaveType => leaveType.leave_balances)
  @JoinColumn({ name: 'leave_type_id' })
  leave_type: LeaveType;
} 