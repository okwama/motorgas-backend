import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum ConversionType {
  FULL = 'Full',
  PARTIAL = 'Partial',
}

@Entity('vehicle_conversions')
export class VehicleConversion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'vehicle_plate', type: 'varchar', length: 20 })
  vehiclePlate: string;

  @Column({ name: 'vehicle_type', type: 'varchar', length: 50 })
  vehicleType: string;

  @Column({ 
    name: 'conversion_type', 
    type: 'varchar', 
    length: 100,
    enum: ConversionType 
  })
  conversionType: ConversionType;

  @Column({ 
    name: 'amount_charged', 
    type: 'decimal', 
    precision: 10, 
    scale: 2 
  })
  amountCharged: number;

  @Column({ 
    name: 'service_date', 
    type: 'date' 
  })
  serviceDate: Date;

  @Column({ 
    name: 'comment', 
    type: 'text', 
    nullable: true 
  })
  comment?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
