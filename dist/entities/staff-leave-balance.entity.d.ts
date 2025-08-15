import { Staff } from './staff.entity';
import { LeaveType } from './leave-type.entity';
export declare class StaffLeaveBalance {
    id: number;
    staff_id: number;
    leave_type_id: number;
    year: number;
    accrued: number;
    used: number;
    carried_forward: number;
    staff: Staff;
    leave_type: LeaveType;
}
