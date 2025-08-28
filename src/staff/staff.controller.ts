import { Controller, Get, Put, Param, Body, UseGuards, Request, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Staff } from '../entities/staff.entity';
import { CheckinRecord } from '../entities/checkin-record.entity';

@Controller('staff')
@UseGuards(JwtAuthGuard)
export class StaffController {
  constructor(
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
    @InjectRepository(CheckinRecord)
    private checkinRepository: Repository<CheckinRecord>,
  ) {}

  @Get('all')
  async getAllStaff(@Request() req) {
    // Only managers can access all staff data
    const currentStaff = await this.staffRepository.findOne({
      where: { id: req.user.userId },
    });

    if (!currentStaff || currentStaff.role !== 'Manager') {
      throw new Error('Unauthorized access - Manager role required');
    }

    const allStaff = await this.staffRepository.find({
      relations: ['station'],
      order: { name: 'ASC' },
    });

    return {
      success: true,
      data: allStaff.map(staff => ({
        id: staff.id,
        name: staff.name,
        phone: staff.phone,
        role: staff.role,
        empl_no: staff.empl_no,
        station_id: staff.station_id,
        station: staff.station,
        photo_url: staff.photo_url,
        status: staff.status,
        created_at: staff.created_at,
      })),
    };
  }

  @Get(':id')
  async getStaffById(@Param('id') id: number, @Request() req) {
    // Managers can access any staff profile, others can only access their own
    const currentStaff = await this.staffRepository.findOne({
      where: { id: req.user.userId },
    });

    if (!currentStaff) {
      throw new Error('User not found');
    }

    // Allow access if user is manager or accessing their own profile
    if (currentStaff.role !== 'Manager' && req.user.userId !== id) {
      throw new Error('Unauthorized access');
    }

    const staff = await this.staffRepository.findOne({
      where: { id },
      relations: ['station'],
    });

    if (!staff) {
      throw new Error('Staff not found');
    }

    return {
      id: staff.id,
      name: staff.name,
      phone: staff.phone,
      role: staff.role,
      empl_no: staff.empl_no,
      station_id: staff.station_id,
      station: staff.station,
      photo_url: staff.photo_url,
      status: staff.status,
    };
  }

  @Post('create')
  async createStaff(@Body() staffData: any, @Request() req) {
    // Only managers can create staff
    const currentStaff = await this.staffRepository.findOne({
      where: { id: req.user.userId },
    });

    if (!currentStaff || currentStaff.role !== 'Manager') {
      throw new Error('Unauthorized access - Manager role required');
    }

    const newStaff = this.staffRepository.create(staffData);
    const savedStaff = await this.staffRepository.save(newStaff);

    return {
      success: true,
      data: savedStaff,
      message: 'Staff created successfully',
    };
  }

  @Put(':id')
  async updateStaff(@Param('id') id: number, @Body() updateData: any, @Request() req) {
    // Managers can update any staff, others can only update their own profile
    const currentStaff = await this.staffRepository.findOne({
      where: { id: req.user.userId },
    });

    if (!currentStaff) {
      throw new Error('User not found');
    }

    // Allow update if user is manager or updating their own profile
    if (currentStaff.role !== 'Manager' && req.user.userId !== id) {
      throw new Error('Unauthorized access');
    }

    // Define allowed fields based on role
    let allowedFields = ['name', 'phone', 'photo_url'];
    if (currentStaff.role === 'Manager') {
      allowedFields = ['name', 'phone', 'photo_url', 'role', 'empl_no', 'id_no', 'salary', 'status'];
    }

    const filteredData = Object.keys(updateData)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updateData[key];
        return obj;
      }, {});

    await this.staffRepository.update(id, filteredData);

    return { success: true, message: 'Staff updated successfully' };
  }

  @Get(':id/statistics')
  async getStaffStatistics(@Param('id') id: number, @Request() req) {
    // Managers can access any staff statistics, others can only access their own
    const currentStaff = await this.staffRepository.findOne({
      where: { id: req.user.userId },
    });

    if (!currentStaff) {
      throw new Error('User not found');
    }

    // Allow access if user is manager or accessing their own statistics
    if (currentStaff.role !== 'Manager' && req.user.userId !== id) {
      throw new Error('Unauthorized access');
    }

    // Get checkin records for the staff member
    const checkinRecords = await this.checkinRepository.find({
      where: { user_id: id },
      order: { time_in: 'DESC' },
    });

    // Calculate statistics
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const checkinsThisMonth = checkinRecords.filter(
      record => new Date(record.time_in) >= startOfMonth
    ).length;

    const todayActivity = checkinRecords.filter(
      record => new Date(record.time_in) >= startOfDay
    ).length;

    // Get unique stations visited
    const uniqueStations = new Set(
      checkinRecords.map(record => record.station_id)
    ).size;

    // Calculate consistency score (simplified)
    const totalCheckins = checkinRecords.length;
    const consistencyScore = totalCheckins > 0 ? Math.min(100, Math.round((totalCheckins / 30) * 100)) : 0;

    return {
      days_active: totalCheckins,
      performance_metrics: {
        checkins_this_month: checkinsThisMonth,
        today_activity: todayActivity,
        outlets_visited: uniqueStations,
        consistency_score: consistencyScore,
      },
    };
  }

  @Get(':id/activity')
  async getStaffActivity(@Param('id') id: number, @Request() req) {
    // Managers can access any staff activity, others can only access their own
    const currentStaff = await this.staffRepository.findOne({
      where: { id: req.user.userId },
    });

    if (!currentStaff) {
      throw new Error('User not found');
    }

    // Allow access if user is manager or accessing their own activity
    if (currentStaff.role !== 'Manager' && req.user.userId !== id) {
      throw new Error('Unauthorized access');
    }

    const checkinRecords = await this.checkinRepository.find({
      where: { user_id: id },
      relations: ['station'],
      order: { time_in: 'DESC' },
      take: 50, // Limit to last 50 records
    });

    return checkinRecords.map(record => ({
      id: record.id,
      checkin_time: record.time_in,
      checkout_time: record.time_out,
      station_name: record.station?.name || record.station_name || 'Unknown Station',
      duration: record.time_out 
        ? Math.round((new Date(record.time_out).getTime() - new Date(record.time_in).getTime()) / (1000 * 60 * 60))
        : null,
    }));
  }

  @Get(':id/performance')
  async getStaffPerformance(@Param('id') id: number, @Request() req) {
    // Managers can access any staff performance, others can only access their own
    const currentStaff = await this.staffRepository.findOne({
      where: { id: req.user.userId },
    });

    if (!currentStaff) {
      throw new Error('User not found');
    }

    // Allow access if user is manager or accessing their own performance
    if (currentStaff.role !== 'Manager' && req.user.userId !== id) {
      throw new Error('Unauthorized access');
    }

    const checkinRecords = await this.checkinRepository.find({
      where: { user_id: id },
    });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const checkinsThisMonth = checkinRecords.filter(
      record => new Date(record.time_in) >= startOfMonth
    ).length;

    const todayActivity = checkinRecords.filter(
      record => new Date(record.time_in) >= startOfDay
    ).length;

    const uniqueStations = new Set(
      checkinRecords.map(record => record.station_id)
    ).size;

    const totalCheckins = checkinRecords.length;
    const consistencyScore = totalCheckins > 0 ? Math.min(100, Math.round((totalCheckins / 30) * 100)) : 0;

    // Calculate average checkin time
    const completedCheckins = checkinRecords.filter(record => record.time_out);
    const totalHours = completedCheckins.reduce((sum, record) => {
      const duration = new Date(record.time_out!).getTime() - new Date(record.time_in).getTime();
      return sum + (duration / (1000 * 60 * 60));
    }, 0);
    const averageCheckinTime = completedCheckins.length > 0 ? Math.round(totalHours / completedCheckins.length) : 0;

    return {
      checkins_this_month: checkinsThisMonth,
      today_activity: todayActivity,
      outlets_visited: uniqueStations,
      consistency_score: consistencyScore,
      average_checkin_time: averageCheckinTime,
      total_checkins: totalCheckins,
    };
  }


}
