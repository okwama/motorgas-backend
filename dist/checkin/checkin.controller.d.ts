import { CheckinService } from './checkin.service';
import { CheckinDto } from './dto/checkin.dto';
import { CheckoutDto } from './dto/checkout.dto';
export declare class CheckinController {
    private readonly checkinService;
    constructor(checkinService: CheckinService);
    checkin(req: any, checkinDto: CheckinDto): Promise<{
        success: boolean;
        message: string;
        data: import("../entities/checkin-record.entity").CheckinRecord;
    }>;
    checkout(req: any, checkoutDto: CheckoutDto): Promise<{
        success: boolean;
        message: string;
        data: import("../entities/checkin-record.entity").CheckinRecord;
    }>;
    getStatus(req: any): Promise<{
        is_checked_in: boolean;
        checkin_record: import("../entities/checkin-record.entity").CheckinRecord | null;
    }>;
    getHistory(req: any, page?: number, limit?: number): Promise<{
        data: import("../entities/checkin-record.entity").CheckinRecord[];
        total: number;
        page: number;
        limit: number;
        total_pages: number;
    }>;
    getAllCheckins(page?: number, limit?: number): Promise<{
        data: import("../entities/checkin-record.entity").CheckinRecord[];
        total: number;
        page: number;
        limit: number;
        total_pages: number;
    }>;
}
