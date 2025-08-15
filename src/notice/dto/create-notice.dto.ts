import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateNoticeDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsNumber()
  created_by?: number;
}
