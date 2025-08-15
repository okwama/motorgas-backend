import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Staff } from './staff.entity';

@Entity('tokens')
@Index(['staff_id', 'is_valid'])
@Index(['refresh_token', 'is_valid'])
@Index(['access_token'])
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  staff_id: number;

  @Column({ type: 'text' })
  access_token: string;

  @Column({ type: 'varchar', length: 255 })
  refresh_token: string;

  @Column({ type: 'datetime', precision: 3 })
  expires_at: Date;

  @CreateDateColumn({ type: 'datetime', precision: 3 })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime', precision: 3 })
  updated_at: Date;

  @Column({ type: 'tinyint', default: 1 })
  is_valid: number;

  @Column({ type: 'datetime', precision: 3, default: () => 'CURRENT_TIMESTAMP(3)' })
  last_used_at: Date;

  @Column({ type: 'text', nullable: true })
  device_info: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ip_address: string;

  // Enhanced security fields
  @Column({ type: 'varchar', length: 255, nullable: true })
  device_id: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  user_agent: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  device_type: string; // 'mobile', 'tablet', 'desktop'

  @Column({ type: 'varchar', length: 50, nullable: true })
  app_version: string;

  @Column({ type: 'int', default: 0 })
  refresh_count: number; // Track how many times token was refreshed

  @Column({ type: 'datetime', precision: 3, nullable: true })
  refresh_expires_at: Date; // Separate expiry for refresh token

  @Column({ type: 'tinyint', default: 0 })
  is_primary: number; // Mark primary device session

  @Column({ type: 'text', nullable: true })
  location_info: string; // Store location data for security

  // Relations
  @ManyToOne(() => Staff, staff => staff.tokens)
  @JoinColumn({ name: 'staff_id' })
  staff: Staff;
} 