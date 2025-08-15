import { Repository } from 'typeorm';
import { StaffLeave } from '../entities/staff-leave.entity';
import { StaffLeaveBalance } from '../entities/staff-leave-balance.entity';
import { LeaveType } from '../entities/leave-type.entity';
import { Staff } from '../entities/staff.entity';
import { ApplyLeaveDto } from './dto/apply-leave.dto';
import { ApproveLeaveDto } from './dto/approve-leave.dto';
export declare class LeaveService {
    private staffLeaveRepository;
    private staffLeaveBalanceRepository;
    private leaveTypeRepository;
    private staffRepository;
    constructor(staffLeaveRepository: Repository<StaffLeave>, staffLeaveBalanceRepository: Repository<StaffLeaveBalance>, leaveTypeRepository: Repository<LeaveType>, staffRepository: Repository<Staff>);
    applyLeave(userId: number, applyLeaveDto: ApplyLeaveDto): Promise<{
        success: boolean;
        message: string;
        data: StaffLeave;
    }>;
    approveLeave(approverId: number, leaveId: number, approveLeaveDto: ApproveLeaveDto): Promise<{
        success: boolean;
        message: string;
        data: StaffLeave;
    }>;
    getLeaveApplications(userId: number, page?: number, limit?: number): Promise<{
        data: StaffLeave[];
        total: number;
        page: number;
        limit: number;
        total_pages: number;
    }>;
    getAllLeaveApplications(page?: number, limit?: number): Promise<{
        data: StaffLeave[];
        total: number;
        page: number;
        limit: number;
        total_pages: number;
    }>;
    getLeaveBalance(userId: number): Promise<{
        data: StaffLeaveBalance[];
    }>;
    getLeaveTypes(): Promise<{
        data: LeaveType[];
    }>;
    private updateLeaveBalance;
}
