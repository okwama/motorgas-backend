import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Client } from './client.entity';
import { Station } from './station.entity';
import { Staff } from './staff.entity';

@Entity('sales')
export class Sale {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  client_id: number;

  @Column({ type: 'int' })
  station_id: number;

  @Column({ type: 'int' })
  vehicle_id: number;

  @Column({ type: 'decimal', precision: 11, scale: 2 })
  quantity: number;

  @Column({ type: 'decimal', precision: 11, scale: 2 })
  unit_price: number;

  @Column({ type: 'decimal', precision: 11, scale: 2 })
  total_price: number;

  @Column({ type: 'datetime' })
  sale_date: Date;

  @Column({ type: 'int', nullable: true })
  staff_id: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  // Relations
  @ManyToOne(() => Client)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @ManyToOne(() => Station)
  @JoinColumn({ name: 'station_id' })
  station: Station;

  @ManyToOne(() => Staff)
  @JoinColumn({ name: 'staff_id' })
  staff: Staff;
}
