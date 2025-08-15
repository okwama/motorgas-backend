import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateSosDto {
  @IsNumber()
  @IsNotEmpty()
  guard_id: number;

  @IsString()
  @IsNotEmpty()
  guard_name: string;

  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @IsNumber()
  @IsNotEmpty()
  longitude: number;

  @IsOptional()
  @IsString()
  sos_type?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  comment?: string;
}
