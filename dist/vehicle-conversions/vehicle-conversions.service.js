"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleConversionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const vehicle_conversion_entity_1 = require("../entities/vehicle-conversion.entity");
let VehicleConversionsService = class VehicleConversionsService {
    vehicleConversionRepository;
    constructor(vehicleConversionRepository) {
        this.vehicleConversionRepository = vehicleConversionRepository;
    }
    async create(createVehicleConversionDto) {
        console.log('Creating conversion with DTO:', JSON.stringify(createVehicleConversionDto, null, 2));
        const conversion = this.vehicleConversionRepository.create({
            vehiclePlate: createVehicleConversionDto.vehicle_plate,
            vehicleType: createVehicleConversionDto.vehicle_type,
            conversionType: createVehicleConversionDto.conversion_type,
            amountCharged: createVehicleConversionDto.amount_charged,
            serviceDate: new Date(createVehicleConversionDto.service_date),
            comment: createVehicleConversionDto.comment,
        });
        console.log('Created entity:', JSON.stringify(conversion, null, 2));
        return await this.vehicleConversionRepository.save(conversion);
    }
    async findAll(queryDto) {
        const queryBuilder = this.vehicleConversionRepository.createQueryBuilder('conversion');
        if (queryDto.start_date) {
            queryBuilder.andWhere('conversion.serviceDate >= :startDate', {
                startDate: new Date(queryDto.start_date),
            });
        }
        if (queryDto.end_date) {
            queryBuilder.andWhere('conversion.serviceDate <= :endDate', {
                endDate: new Date(queryDto.end_date),
            });
        }
        if (queryDto.conversion_type) {
            queryBuilder.andWhere('conversion.conversionType = :conversionType', {
                conversionType: queryDto.conversion_type,
            });
        }
        queryBuilder.orderBy('conversion.createdAt', 'DESC');
        return await queryBuilder.getManyAndCount();
    }
    async findOne(id) {
        const conversion = await this.vehicleConversionRepository.findOne({
            where: { id },
        });
        if (!conversion) {
            throw new Error('Vehicle conversion not found');
        }
        return conversion;
    }
    async update(id, updateVehicleConversionDto) {
        const conversion = await this.findOne(id);
        if (updateVehicleConversionDto.service_date) {
            conversion.serviceDate = new Date(updateVehicleConversionDto.service_date);
        }
        if (updateVehicleConversionDto.vehicle_plate) {
            conversion.vehiclePlate = updateVehicleConversionDto.vehicle_plate;
        }
        if (updateVehicleConversionDto.vehicle_type) {
            conversion.vehicleType = updateVehicleConversionDto.vehicle_type;
        }
        if (updateVehicleConversionDto.conversion_type) {
            conversion.conversionType = updateVehicleConversionDto.conversion_type;
        }
        if (updateVehicleConversionDto.amount_charged) {
            conversion.amountCharged = updateVehicleConversionDto.amount_charged;
        }
        if (updateVehicleConversionDto.comment !== undefined) {
            conversion.comment = updateVehicleConversionDto.comment;
        }
        return await this.vehicleConversionRepository.save(conversion);
    }
    async remove(id) {
        const conversion = await this.findOne(id);
        await this.vehicleConversionRepository.remove(conversion);
    }
    async getStats(queryDto) {
        const queryBuilder = this.vehicleConversionRepository.createQueryBuilder('conversion');
        if (queryDto.start_date) {
            queryBuilder.andWhere('conversion.serviceDate >= :startDate', {
                startDate: new Date(queryDto.start_date),
            });
        }
        if (queryDto.end_date) {
            queryBuilder.andWhere('conversion.serviceDate <= :endDate', {
                endDate: new Date(queryDto.end_date),
            });
        }
        const totalConversions = await queryBuilder.getCount();
        const totalAmount = await queryBuilder
            .select('SUM(conversion.amountCharged)', 'total')
            .getRawOne();
        const fullConversions = await queryBuilder
            .andWhere('conversion.conversionType = :type', { type: 'Full' })
            .getCount();
        const partialConversions = await queryBuilder
            .andWhere('conversion.conversionType = :type', { type: 'Partial' })
            .getCount();
        return {
            totalConversions,
            totalAmount: parseFloat(totalAmount?.total || '0'),
            fullConversions,
            partialConversions,
            averageAmount: totalConversions > 0 ? parseFloat(totalAmount?.total || '0') / totalConversions : 0,
        };
    }
};
exports.VehicleConversionsService = VehicleConversionsService;
exports.VehicleConversionsService = VehicleConversionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(vehicle_conversion_entity_1.VehicleConversion)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], VehicleConversionsService);
//# sourceMappingURL=vehicle-conversions.service.js.map