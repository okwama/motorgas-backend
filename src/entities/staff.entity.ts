import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Station } from './station.entity';
import { StaffLeave } from './staff-leave.entity';
import { StaffLeaveBalance } from './staff-leave-balance.entity';
import { CheckinRecord } from './checkin-record.entity';
import { Token } from './token.entity';

@Entity('staff')
export class Staff {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password: string;

  @Column({ type: 'int', default: 0 })
  role_id: number;

  @Column({ type: 'varchar', length: 200 })
  role: string;

  @Column({ type: 'int' })
  station_id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  empl_no: string;

  @Column({ type: 'int', nullable: true })
  id_no: number;

  @Column({ type: 'varchar', length: 200, nullable: true })
  photo_url: string;

  @Column({ type: 'int', default: 0 })
  status: number;

  @CreateDateColumn({ type: 'datetime', precision: 3, nullable: true })
  created_at: Date;

  // Relations
  @ManyToOne(() => Station, station => station.staff)
  @JoinColumn({ name: 'station_id' })
  station: Station;

  @OneToMany(() => StaffLeave, leave => leave.staff)
  leaves: StaffLeave[];

  @OneToMany(() => StaffLeaveBalance, balance => balance.staff)
  leave_balances: StaffLeaveBalance[];

  @OneToMany(() => CheckinRecord, checkin => checkin.staff)
  checkin_records: CheckinRecord[];

  @OneToMany(() => Token, token => token.staff)
  tokens: Token[];
} 