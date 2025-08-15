import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { StaffLeave, LeaveStatus } from '../entities/staff-leave.entity';
import { StaffLeaveBalance } from '../entities/staff-leave-balance.entity';
import { LeaveType } from '../entities/leave-type.entity';
import { Staff } from '../entities/staff.entity';
import { ApplyLeaveDto } from './dto/apply-leave.dto';
import { ApproveLeaveDto } from './dto/approve-leave.dto';

@Injectable()
export class LeaveService {
  constructor(
    @InjectRepository(StaffLeave)
    private staffLeaveRepository: Repository<StaffLeave>,
    @InjectRepository(StaffLeaveBalance)
    private staffLeaveBalanceRepository: Repository<StaffLeaveBalance>,
    @InjectRepository(LeaveType)
    private leaveTypeRepository: Repository<LeaveType>,
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
  ) {}

  async applyLeave(userId: number, applyLeaveDto: ApplyLeaveDto) {
    const { leave_type_id, start_date, end_date, is_half_day, reason, attachment_url } = applyLeaveDto;

    // Validate staff member
    const staff = await this.staffRepository.findOne({
      where: { id: userId },
    });

    if (!staff) {
      throw new NotFoundException('Staff member not found');
    }

    // Validate leave type
    const leaveType = await this.leaveTypeRepository.findOne({
      where: { id: leave_type_id },
    });

    if (!leaveType) {
      throw new NotFoundException('Leave type not found');
    }

    // Check for overlapping leaves
    const overlappingLeave = await this.staffLeaveRepository.findOne({
      where: {
        staff_id: userId,
        status: LeaveStatus.APPROVED,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
      },
    });

    if (overlappingLeave) {
      throw new BadRequestException('Leave period overlaps with existing approved leave');
    }

    // Create leave application
    const leaveApplication = this.staffLeaveRepository.create({
      staff_id: userId,
      leave_type_id,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      is_half_day: is_half_day ? 1 : 0,
      reason,
      attachment_url,
      status: LeaveStatus.PENDING,
    });

    const savedLeave = await this.staffLeaveRepository.save(leaveApplication);

    return {
      success: true,
      message: 'Leave application submitted successfully',
      data: savedLeave,
    };
  }

  async approveLeave(approverId: number, leaveId: number, approveLeaveDto: ApproveLeaveDto) {
    const { status, comments } = approveLeaveDto;

    // Find leave application
    const leaveApplication = await this.staffLeaveRepository.findOne({
      where: { id: leaveId },
      relations: ['staff', 'leave_type'],
    });

    if (!leaveApplication) {
      throw new NotFoundException('Leave application not found');
    }

    // Check if already processed
    if (leaveApplication.status !== LeaveStatus.PENDING) {
      throw new BadRequestException('Leave application already processed');
    }

    // Update leave status
    leaveApplication.status = status === 'approved' ? LeaveStatus.APPROVED : LeaveStatus.REJECTED;
    leaveApplication.approved_by = approverId;
    leaveApplication.updated_at = new Date();

    const updatedLeave = await this.staffLeaveRepository.save(leaveApplication);

    // If approved, update leave balance
    if (status === 'approved') {
      await this.updateLeaveBalance(leaveApplication.staff_id, leaveApplication.leave_type_id);
    }

    return {
      success: true,
      message: `Leave application ${status}`,
      data: updatedLeave,
    };
  }

  async getLeaveApplications(userId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [applications, total] = await this.staffLeaveRepository.findAndCount({
      where: { staff_id: userId },
      relations: ['leave_type', 'approver'],
      order: { applied_at: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data: applications,
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    };
  }

  async getAllLeaveApplications(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [applications, total] = await this.staffLeaveRepository.findAndCount({
      relations: ['staff', 'leave_type', 'approver'],
      order: { applied_at: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data: applications,
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    };
  }

  async getLeaveBalance(userId: number) {
    const balances = await this.staffLeaveBalanceRepository.find({
      where: { staff_id: userId },
      relations: ['leave_type'],
    });

    return {
      data: balances,
    };
  }

  async getLeaveTypes() {
    const leaveTypes = await this.leaveTypeRepository.find({
      where: { is_active: 1 },
      order: { name: 'ASC' },
    });

    return {
      data: leaveTypes,
    };
  }

  private async updateLeaveBalance(staffId: number, leaveTypeId: number) {
    const currentYear = new Date().getFullYear();
    
    let balance = await this.staffLeaveBalanceRepository.findOne({
      where: {
        staff_id: staffId,
        leave_type_id: leaveTypeId,
        year: currentYear,
      },
    });

    if (!balance) {
      balance = this.staffLeaveBalanceRepository.create({
        staff_id: staffId,
        leave_type_id: leaveTypeId,
        year: currentYear,
        accrued: 0,
        used: 0,
        carried_forward: 0,
      });
    }

    // Update used days (simplified calculation)
    balance.used += 1;
    await this.staffLeaveBalanceRepository.save(balance);
  }
} 