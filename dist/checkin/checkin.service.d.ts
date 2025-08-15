import { Repository } from 'typeorm';
import { CheckinRecord } from '../entities/checkin-record.entity';
import { Staff } from '../entities/staff.entity';
import { Station } from '../entities/station.entity';
import { CheckinDto } from './dto/checkin.dto';
import { CheckoutDto } from './dto/checkout.dto';
export declare class CheckinService {
    private checkinRepository;
    private staffRepository;
    private stationRepository;
    constructor(checkinRepository: Repository<CheckinRecord>, staffRepository: Repository<Staff>, stationRepository: Repository<Station>);
    checkin(userId: number, checkinDto: CheckinDto): Promise<{
        success: boolean;
        message: string;
        data: CheckinRecord;
    }>;
    checkout(userId: number, checkoutDto: CheckoutDto): Promise<{
        success: boolean;
        message: string;
        data: CheckinRecord;
    }>;
    getCheckinStatus(userId: number): Promise<{
        is_checked_in: boolean;
        checkin_record: CheckinRecord | null;
    }>;
    getCheckinHistory(userId: number, page?: number, limit?: number): Promise<{
        data: CheckinRecord[];
        total: number;
        page: number;
        limit: number;
        total_pages: number;
    }>;
    getAllCheckins(page?: number, limit?: number): Promise<{
        data: CheckinRecord[];
        total: number;
        page: number;
        limit: number;
        total_pages: number;
    }>;
}
