import { Station } from './station.entity';
import { StaffLeave } from './staff-leave.entity';
import { StaffLeaveBalance } from './staff-leave-balance.entity';
import { CheckinRecord } from './checkin-record.entity';
import { Token } from './token.entity';
export declare class Staff {
    id: number;
    name: string;
    phone: string;
    password: string;
    role_id: number;
    role: string;
    station_id: number;
    empl_no: string;
    id_no: number;
    photo_url: string;
    status: number;
    created_at: Date;
    station: Station;
    leaves: StaffLeave[];
    leave_balances: StaffLeaveBalance[];
    checkin_records: CheckinRecord[];
    tokens: Token[];
}
