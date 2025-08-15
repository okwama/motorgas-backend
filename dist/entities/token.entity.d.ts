import { Staff } from './staff.entity';
export declare class Token {
    id: number;
    staff_id: number;
    access_token: string;
    refresh_token: string;
    expires_at: Date;
    created_at: Date;
    updated_at: Date;
    is_valid: number;
    last_used_at: Date;
    device_info: string;
    ip_address: string;
    device_id: string;
    user_agent: string;
    device_type: string;
    app_version: string;
    refresh_count: number;
    refresh_expires_at: Date;
    is_primary: number;
    location_info: string;
    staff: Staff;
}
