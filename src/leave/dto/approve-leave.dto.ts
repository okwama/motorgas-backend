import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ApproveLeaveDto {
  @ApiProperty({
    description: 'Approval status',
    example: 'approved',
    enum: ['approved', 'rejected'],
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['approved', 'rejected'])
  status: 'approved' | 'rejected';

  @ApiProperty({
    description: 'Comments for approval/rejection',
    example: 'Approved - valid reason provided',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  comments: string;
} 