import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('seals')
export class Seal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  seal_number: string;

  @Column({ type: 'varchar', length: 255 })
  seal_type: string;

  @Column({ type: 'varchar', length: 255 })
  status: string;

  @Column({ type: 'int', nullable: true })
  assigned_to: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
