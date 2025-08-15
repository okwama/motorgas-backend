import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CheckinController } from './checkin.controller';
import { CheckinService } from './checkin.service';
import { CheckinRecord } from '../entities/checkin-record.entity';
import { Staff } from '../entities/staff.entity';
import { Station } from '../entities/station.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CheckinRecord, Staff, Station])],
  controllers: [CheckinController],
  providers: [CheckinService],
  exports: [CheckinService],
})
export class CheckinModule {} 