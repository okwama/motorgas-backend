import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LeaveController } from './leave.controller';
import { LeaveService } from './leave.service';
import { StaffLeave } from '../entities/staff-leave.entity';
import { StaffLeaveBalance } from '../entities/staff-leave-balance.entity';
import { LeaveType } from '../entities/leave-type.entity';
import { Staff } from '../entities/staff.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StaffLeave, StaffLeaveBalance, LeaveType, Staff])],
  controllers: [LeaveController],
  providers: [LeaveService],
  exports: [LeaveService],
})
export class LeaveModule {} 