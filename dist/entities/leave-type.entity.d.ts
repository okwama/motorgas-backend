import { StaffLeave } from './staff-leave.entity';
import { StaffLeaveBalance } from './staff-leave-balance.entity';
export declare class LeaveType {
    id: number;
    name: string;
    description: string;
    default_days: number;
    is_active: number;
    created_at: Date;
    updated_at: Date;
    leaves: StaffLeave[];
    leave_balances: StaffLeaveBalance[];
}
