import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Station } from './station.entity';

@Entity('pumps')
export class Pump {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  station_id: number;

  @Column({ type: 'varchar', length: 255 })
  serial_number: string;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  // Relations
  @ManyToOne(() => Station)
  @JoinColumn({ name: 'station_id' })
  station: Station;
}
