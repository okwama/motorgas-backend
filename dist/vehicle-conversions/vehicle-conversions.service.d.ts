import { Repository } from 'typeorm';
import { VehicleConversion } from '../entities/vehicle-conversion.entity';
import { CreateVehicleConversionDto } from './dto/create-vehicle-conversion.dto';
import { UpdateVehicleConversionDto } from './dto/update-vehicle-conversion.dto';
import { QueryVehicleConversionDto } from './dto/query-vehicle-conversion.dto';
export declare class VehicleConversionsService {
    private vehicleConversionRepository;
    constructor(vehicleConversionRepository: Repository<VehicleConversion>);
    create(createVehicleConversionDto: CreateVehicleConversionDto): Promise<VehicleConversion>;
    findAll(queryDto: QueryVehicleConversionDto): Promise<[VehicleConversion[], number]>;
    findOne(id: number): Promise<VehicleConversion>;
    update(id: number, updateVehicleConversionDto: UpdateVehicleConversionDto): Promise<VehicleConversion>;
    remove(id: number): Promise<void>;
    getStats(queryDto: QueryVehicleConversionDto): Promise<any>;
}
