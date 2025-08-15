import { Staff } from './staff.entity';
import { LeaveType } from './leave-type.entity';
export declare enum LeaveStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected"
}
export declare class StaffLeave {
    id: number;
    staff_id: number;
    leave_type_id: number;
    start_date: Date;
    end_date: Date;
    is_half_day: number;
    reason: string;
    status: LeaveStatus;
    approved_by: number;
    attachment_url: string;
    applied_at: Date;
    updated_at: Date;
    staff: Staff;
    leave_type: LeaveType;
    approver: Staff;
}
