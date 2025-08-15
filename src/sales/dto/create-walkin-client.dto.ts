import { IsString, IsOptional, IsEmail } from 'class-validator';

export class CreateWalkInClientDto {
  @IsString()
  name: string;

  @IsString()
  account_number: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  vehicle_number?: string;
}
