import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Staff } from './staff.entity';
import { Station } from './station.entity';

export enum ConversionType {
  COMPLETE = 'complete',
  PARTIAL = 'partial',
}

@Entity('lpg_conversions')
export class LpgConversion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'car_registration', length: 20 })
  carRegistration: string;

  @Column({ name: 'car_model', length: 100 })
  carModel: string;

  @Column({
    name: 'conversion_type',
    type: 'enum',
    enum: ConversionType,
    default: ConversionType.COMPLETE,
  })
  conversionType: ConversionType;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'station_id' })
  stationId: number;

  @Column({ name: 'staff_id' })
  staffId: number;

  @Column({ name: 'conversion_date', type: 'date' })
  conversionDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Staff, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'staff_id' })
  staff: Staff;

  @ManyToOne(() => Station, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'station_id' })
  station: Station;
}
