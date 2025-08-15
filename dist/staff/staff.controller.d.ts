import { Repository } from 'typeorm';
import { Staff } from '../entities/staff.entity';
import { CheckinRecord } from '../entities/checkin-record.entity';
export declare class StaffController {
    private staffRepository;
    private checkinRepository;
    constructor(staffRepository: Repository<Staff>, checkinRepository: Repository<CheckinRecord>);
    getStaffById(id: number, req: any): Promise<{
        id: number;
        name: string;
        phone: string;
        role: string;
        empl_no: string;
        station_id: number;
        station: import("../entities/station.entity").Station;
        photo_url: string;
        status: number;
    }>;
    updateStaff(id: number, updateData: any, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    getStaffStatistics(id: number, req: any): Promise<{
        days_active: number;
        performance_metrics: {
            checkins_this_month: number;
            today_activity: number;
            outlets_visited: number;
            consistency_score: number;
        };
    }>;
    getStaffActivity(id: number, req: any): Promise<{
        id: number;
        checkin_time: Date;
        checkout_time: Date;
        station_name: string;
        duration: number | null;
    }[]>;
    getStaffPerformance(id: number, req: any): Promise<{
        checkins_this_month: number;
        today_activity: number;
        outlets_visited: number;
        consistency_score: number;
        average_checkin_time: number;
        total_checkins: number;
    }>;
}
