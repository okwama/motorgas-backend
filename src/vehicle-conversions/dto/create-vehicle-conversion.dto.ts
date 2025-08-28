import { IsString, IsNumber, IsDateString, IsOptional, IsEnum, IsNotEmpty } from 'class-validator';
import { ConversionType } from '../../entities/vehicle-conversion.entity';

export class CreateVehicleConversionDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsString()
  @IsNotEmpty()
  vehicle_plate: string;

  @IsString()
  @IsNotEmpty()
  vehicle_type: string;

  @IsEnum(ConversionType)
  conversion_type: ConversionType;

  @IsNumber()
  @IsNotEmpty()
  amount_charged: number;

  @IsDateString()
  @IsNotEmpty()
  service_date: string;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsOptional()
  @IsDateString()
  created_at?: string;
}
