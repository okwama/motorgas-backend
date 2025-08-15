import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('sos')
export class Sos {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 191, default: 'sos' })
  sos_type: string;

  @Column({ type: 'double' })
  latitude: number;

  @Column({ type: 'double' })
  longitude: number;

  @Column({ type: 'varchar', length: 191, default: 'active' })
  status: string;

  @Column({ type: 'varchar', length: 255 })
  guard_name: string;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ type: 'int' })
  guard_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
