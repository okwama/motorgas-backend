import { IsOptional, IsDateString, IsEnum } from 'class-validator';
import { ConversionType } from '../../entities/vehicle-conversion.entity';

export class QueryVehicleConversionDto {
  @IsDateString()
  @IsOptional()
  start_date?: string;

  @IsDateString()
  @IsOptional()
  end_date?: string;

  @IsEnum(ConversionType)
  @IsOptional()
  conversion_type?: ConversionType;
}
