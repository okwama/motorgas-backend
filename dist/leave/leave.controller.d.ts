import { LeaveService } from './leave.service';
import { ApplyLeaveDto } from './dto/apply-leave.dto';
import { ApproveLeaveDto } from './dto/approve-leave.dto';
export declare class LeaveController {
    private readonly leaveService;
    constructor(leaveService: LeaveService);
    applyLeave(req: any, applyLeaveDto: ApplyLeaveDto): Promise<{
        success: boolean;
        message: string;
        data: import("../entities/staff-leave.entity").StaffLeave;
    }>;
    approveLeave(req: any, leaveId: number, approveLeaveDto: ApproveLeaveDto): Promise<{
        success: boolean;
        message: string;
        data: import("../entities/staff-leave.entity").StaffLeave;
    }>;
    getLeaveApplications(req: any, page?: number, limit?: number): Promise<{
        data: import("../entities/staff-leave.entity").StaffLeave[];
        total: number;
        page: number;
        limit: number;
        total_pages: number;
    }>;
    getAllLeaveApplications(page?: number, limit?: number): Promise<{
        data: import("../entities/staff-leave.entity").StaffLeave[];
        total: number;
        page: number;
        limit: number;
        total_pages: number;
    }>;
    getLeaveBalance(req: any): Promise<{
        data: import("../entities/staff-leave-balance.entity").StaffLeaveBalance[];
    }>;
    getLeaveTypes(): Promise<{
        data: import("../entities/leave-type.entity").LeaveType[];
    }>;
}
