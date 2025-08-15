import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Staff } from '../entities/staff.entity';
import { CheckinRecord } from '../entities/checkin-record.entity';
import { StaffController } from './staff.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Staff, CheckinRecord])],
  controllers: [StaffController],
  exports: [TypeOrmModule],
})
export class StaffModule {} 