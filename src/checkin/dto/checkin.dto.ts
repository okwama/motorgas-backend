import { IsNumber, IsNotEmpty, IsOptional, IsString, IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckinDto {
  @ApiProperty({
    description: 'Station ID to check in to',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  station_id: number;

  @ApiProperty({
    description: 'Latitude coordinate',
    example: -1.30089695,
  })
  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @ApiProperty({
    description: 'Longitude coordinate',
    example: 36.77774156,
  })
  @IsNumber()
  @IsNotEmpty()
  longitude: number;

  @ApiProperty({
    description: 'Address of the location',
    example: 'Ndemi Lane, Nairobi',
    required: false,
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({
    description: 'QR code data',
    example: '1',
    required: false,
  })
  @IsString()
  @IsOptional()
  qr_data?: string;
} 