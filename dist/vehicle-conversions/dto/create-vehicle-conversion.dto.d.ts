import { ConversionType } from '../../entities/vehicle-conversion.entity';
export declare class CreateVehicleConversionDto {
    id?: number;
    vehicle_plate: string;
    vehicle_type: string;
    conversion_type: ConversionType;
    amount_charged: number;
    service_date: string;
    comment?: string;
    created_at?: string;
}
