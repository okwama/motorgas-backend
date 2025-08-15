import { IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckoutDto {
  @ApiProperty({
    description: 'Latitude coordinate for check-out',
    example: -1.30089695,
  })
  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @ApiProperty({
    description: 'Longitude coordinate for check-out',
    example: 36.77774156,
  })
  @IsNumber()
  @IsNotEmpty()
  longitude: number;
} 