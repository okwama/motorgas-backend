import { IsNumber, IsNotEmpty, IsOptional, IsString, IsBoolean, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ApplyLeaveDto {
  @ApiProperty({
    description: 'Leave type ID',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  leave_type_id: number;

  @ApiProperty({
    description: 'Start date of leave',
    example: '2025-07-04',
  })
  @IsDateString()
  @IsNotEmpty()
  start_date: string;

  @ApiProperty({
    description: 'End date of leave',
    example: '2025-07-19',
  })
  @IsDateString()
  @IsNotEmpty()
  end_date: string;

  @ApiProperty({
    description: 'Is half day leave',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  is_half_day?: boolean;

  @ApiProperty({
    description: 'Reason for leave',
    example: 'Personal vacation',
    required: false,
  })
  @IsString()
  @IsOptional()
  reason?: string;

  @ApiProperty({
    description: 'Attachment URL',
    example: '/uploads/leave_document.pdf',
    required: false,
  })
  @IsString()
  @IsOptional()
  attachment_url?: string;
} 