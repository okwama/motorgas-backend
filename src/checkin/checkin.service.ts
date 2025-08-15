import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CheckinRecord } from '../entities/checkin-record.entity';
import { Staff } from '../entities/staff.entity';
import { Station } from '../entities/station.entity';
import { CheckinDto } from './dto/checkin.dto';
import { CheckoutDto } from './dto/checkout.dto';

@Injectable()
export class CheckinService {
  constructor(
    @InjectRepository(CheckinRecord)
    private checkinRepository: Repository<CheckinRecord>,
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
    @InjectRepository(Station)
    private stationRepository: Repository<Station>,
  ) {}

  async checkin(userId: number, checkinDto: CheckinDto) {
    const { station_id, latitude, longitude, address, qr_data } = checkinDto;

    // Find staff member
    const staff = await this.staffRepository.findOne({
      where: { id: userId },
      relations: ['station'],
    });

    if (!staff) {
      throw new NotFoundException('Staff member not found');
    }

    // Find station
    const station = await this.stationRepository.findOne({
      where: { id: station_id },
    });

    if (!station) {
      throw new NotFoundException('Station not found');
    }

    // Check if already checked in
    const existingCheckin = await this.checkinRepository.findOne({
      where: {
        user_id: userId,
        status: 1, // Active checkin
      },
    });

    if (existingCheckin) {
      throw new BadRequestException('Already checked in');
    }

    // Create checkin record
    const checkinRecord = this.checkinRepository.create({
      user_id: userId,
      user_name: staff.name,
      station_id,
      station_name: station.name,
      check_in_latitude: latitude,
      check_in_longitude: longitude,
      address,
      qr_data,
      status: 1, // Active
      time_in: new Date(),
    });

    const savedRecord = await this.checkinRepository.save(checkinRecord);

    return {
      success: true,
      message: 'Check-in successful',
      data: savedRecord,
    };
  }

  async checkout(userId: number, checkoutDto: CheckoutDto) {
    const { latitude, longitude } = checkoutDto;

    // Find active checkin record
    const checkinRecord = await this.checkinRepository.findOne({
      where: {
        user_id: userId,
        status: 1, // Active checkin
      },
    });

    if (!checkinRecord) {
      throw new BadRequestException('No active check-in found');
    }

    // Update checkin record
    checkinRecord.check_out_latitude = latitude;
    checkinRecord.check_out_longitude = longitude;
    checkinRecord.status = 0; // Inactive
    checkinRecord.time_out = new Date();

    const updatedRecord = await this.checkinRepository.save(checkinRecord);

    return {
      success: true,
      message: 'Check-out successful',
      data: updatedRecord,
    };
  }

  async getCheckinStatus(userId: number) {
    const activeCheckin = await this.checkinRepository.findOne({
      where: {
        user_id: userId,
        status: 1, // Active
      },
      relations: ['station'],
    });

    return {
      is_checked_in: !!activeCheckin,
      checkin_record: activeCheckin,
    };
  }

  async getCheckinHistory(userId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [records, total] = await this.checkinRepository.findAndCount({
      where: { user_id: userId },
      relations: ['station'],
      order: { created_at: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data: records,
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    };
  }

  async getAllCheckins(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [records, total] = await this.checkinRepository.findAndCount({
      relations: ['station', 'staff'],
      order: { created_at: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data: records,
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    };
  }
} 