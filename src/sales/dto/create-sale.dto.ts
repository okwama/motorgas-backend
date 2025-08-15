import { IsNumber, IsPositive, IsDateString, IsOptional } from 'class-validator';

export class CreateSaleDto {
  @IsNumber()
  client_id: number;

  @IsNumber()
  station_id: number;

  @IsNumber()
  vehicle_id: number;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsPositive()
  unit_price: number;

  @IsNumber()
  @IsPositive()
  total_price: number;

  @IsDateString()
  sale_date: string;

  @IsOptional()
  @IsNumber()
  staff_id?: number;
}
