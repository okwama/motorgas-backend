import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Staff } from './staff.entity';
import { LeaveType } from './leave-type.entity';

export enum LeaveStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('staff_leaves')
export class StaffLeave {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  staff_id: number;

  @Column({ type: 'int' })
  leave_type_id: number;

  @Column({ type: 'date' })
  start_date: Date;

  @Column({ type: 'date' })
  end_date: Date;

  @Column({ type: 'tinyint', default: 0 })
  is_half_day: number;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @Column({ 
    type: 'varchar', 
    length: 20, 
    default: LeaveStatus.PENDING 
  })
  status: LeaveStatus;

  @Column({ type: 'int', nullable: true })
  approved_by: number;

  @Column({ type: 'text', nullable: true })
  attachment_url: string;

  @CreateDateColumn({ type: 'timestamp' })
  applied_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  // Relations
  @ManyToOne(() => Staff, staff => staff.leaves)
  @JoinColumn({ name: 'staff_id' })
  staff: Staff;

  @ManyToOne(() => LeaveType, leaveType => leaveType.leaves)
  @JoinColumn({ name: 'leave_type_id' })
  leave_type: LeaveType;

  @ManyToOne(() => Staff)
  @JoinColumn({ name: 'approved_by' })
  approver: Staff;
} 