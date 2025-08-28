import { Staff } from './staff.entity';
import { Station } from './station.entity';
export declare enum ConversionType {
    COMPLETE = "complete",
    PARTIAL = "partial"
}
export declare class LpgConversion {
    id: number;
    carRegistration: string;
    carModel: string;
    conversionType: ConversionType;
    notes: string;
    stationId: number;
    staffId: number;
    conversionDate: Date;
    createdAt: Date;
    updatedAt: Date;
    staff: Staff;
    station: Station;
}
