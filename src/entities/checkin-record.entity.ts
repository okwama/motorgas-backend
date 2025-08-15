import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Staff } from './staff.entity';
import { Station } from './station.entity';

@Entity('checkin_records')
export class CheckinRecord {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'int' })
  user_id: number;

  @Column({ type: 'varchar', length: 255 })
  user_name: string;

  @Column({ type: 'int' })
  station_id: number;

  @Column({ type: 'varchar', length: 255 })
  station_name: string;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  check_in_latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  check_in_longitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  check_out_latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  check_out_longitude: number;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'int', default: 0 })
  status: number;

  @Column({ type: 'datetime', nullable: true })
  time_in: Date;

  @Column({ type: 'datetime', nullable: true })
  time_out: Date;

  @Column({ type: 'text', nullable: true })
  qr_data: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  // Relations
  @ManyToOne(() => Staff, staff => staff.checkin_records)
  @JoinColumn({ name: 'user_id' })
  staff: Staff;

  @ManyToOne(() => Station)
  @JoinColumn({ name: 'station_id' })
  station: Station;
} 