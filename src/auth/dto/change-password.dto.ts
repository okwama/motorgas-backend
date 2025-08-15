import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, IsNumber } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ description: 'Phone number of the user' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ description: 'User ID' })
  @IsNumber()
  userId: number;

  @ApiProperty({ description: 'Current password' })
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({ description: 'New password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
}
