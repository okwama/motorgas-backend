import { VehicleConversionsService } from './vehicle-conversions.service';
import { CreateVehicleConversionDto } from './dto/create-vehicle-conversion.dto';
import { UpdateVehicleConversionDto } from './dto/update-vehicle-conversion.dto';
import { QueryVehicleConversionDto } from './dto/query-vehicle-conversion.dto';
import { Request } from 'express';
interface AuthenticatedRequest extends Request {
    user: {
        userId: number;
    };
}
export declare class VehicleConversionsController {
    private readonly vehicleConversionsService;
    constructor(vehicleConversionsService: VehicleConversionsService);
    create(createVehicleConversionDto: CreateVehicleConversionDto, request: AuthenticatedRequest): Promise<{
        success: boolean;
        message: string;
        data: import("../entities/vehicle-conversion.entity").VehicleConversion;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    findAll(queryDto: QueryVehicleConversionDto): Promise<{
        success: boolean;
        message: string;
        data: import("../entities/vehicle-conversion.entity").VehicleConversion[];
        total: number;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
        total?: undefined;
    }>;
    getStats(queryDto: QueryVehicleConversionDto): Promise<{
        success: boolean;
        message: string;
        data: any;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        message: string;
        data: import("../entities/vehicle-conversion.entity").VehicleConversion;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    update(id: string, updateVehicleConversionDto: UpdateVehicleConversionDto): Promise<{
        success: boolean;
        message: string;
        data: import("../entities/vehicle-conversion.entity").VehicleConversion;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: any;
    }>;
}
export {};
