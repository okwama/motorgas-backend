import { Staff } from './staff.entity';
import { Station } from './station.entity';
export declare class CheckinRecord {
    id: number;
    user_id: number;
    user_name: string;
    station_id: number;
    station_name: string;
    check_in_latitude: number;
    check_in_longitude: number;
    check_out_latitude: number;
    check_out_longitude: number;
    address: string;
    status: number;
    time_in: Date;
    time_out: Date;
    qr_data: string;
    created_at: Date;
    updated_at: Date;
    staff: Staff;
    station: Station;
}
