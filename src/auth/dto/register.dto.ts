import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, Matches, IsOptional, IsNumber } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ description: 'Full name of the staff member' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @ApiProperty({ description: 'Phone number (Kenya format)' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?:\+254|0)?[17]\d{8}$/, {
    message: 'Phone number must be a valid Kenya phone number',
  })
  phone: string;

  @ApiProperty({ description: 'Employee number' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  empl_no: string;

  @ApiProperty({ description: 'Staff role' })
  @IsString()
  @IsNotEmpty()
  role: string;

  @ApiProperty({ description: 'Password' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: 'Station ID (optional)', required: false })
  @IsOptional()
  @IsNumber()
  station_id?: number;

  @ApiProperty({ description: 'Staff status (1 for active, 0 for inactive)', required: false })
  @IsOptional()
  @IsNumber()
  status?: number;
}

