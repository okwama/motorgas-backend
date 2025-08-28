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
exports.VehicleConversionsController = void 0;
const common_1 = require("@nestjs/common");
const vehicle_conversions_service_1 = require("./vehicle-conversions.service");
const create_vehicle_conversion_dto_1 = require("./dto/create-vehicle-conversion.dto");
const update_vehicle_conversion_dto_1 = require("./dto/update-vehicle-conversion.dto");
const query_vehicle_conversion_dto_1 = require("./dto/query-vehicle-conversion.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let VehicleConversionsController = class VehicleConversionsController {
    vehicleConversionsService;
    constructor(vehicleConversionsService) {
        this.vehicleConversionsService = vehicleConversionsService;
    }
    async create(createVehicleConversionDto, request) {
        try {
            console.log('Received DTO:', JSON.stringify(createVehicleConversionDto, null, 2));
            const conversion = await this.vehicleConversionsService.create(createVehicleConversionDto);
            return {
                success: true,
                message: 'Vehicle conversion recorded successfully',
                data: conversion,
            };
        }
        catch (error) {
            console.error('Error creating vehicle conversion:', error);
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async findAll(queryDto) {
        try {
            const [conversions, total] = await this.vehicleConversionsService.findAll(queryDto);
            return {
                success: true,
                message: 'Vehicle conversions retrieved successfully',
                data: conversions,
                total,
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async getStats(queryDto) {
        try {
            const stats = await this.vehicleConversionsService.getStats(queryDto);
            return {
                success: true,
                message: 'Vehicle conversion statistics retrieved successfully',
                data: stats,
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async findOne(id) {
        try {
            const conversion = await this.vehicleConversionsService.findOne(+id);
            return {
                success: true,
                message: 'Vehicle conversion retrieved successfully',
                data: conversion,
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async update(id, updateVehicleConversionDto) {
        try {
            const conversion = await this.vehicleConversionsService.update(+id, updateVehicleConversionDto);
            return {
                success: true,
                message: 'Vehicle conversion updated successfully',
                data: conversion,
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async remove(id) {
        try {
            await this.vehicleConversionsService.remove(+id);
            return {
                success: true,
                message: 'Vehicle conversion deleted successfully',
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
};
exports.VehicleConversionsController = VehicleConversionsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_vehicle_conversion_dto_1.CreateVehicleConversionDto, Object]),
    __metadata("design:returntype", Promise)
], VehicleConversionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_vehicle_conversion_dto_1.QueryVehicleConversionDto]),
    __metadata("design:returntype", Promise)
], VehicleConversionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_vehicle_conversion_dto_1.QueryVehicleConversionDto]),
    __metadata("design:returntype", Promise)
], VehicleConversionsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VehicleConversionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_vehicle_conversion_dto_1.UpdateVehicleConversionDto]),
    __metadata("design:returntype", Promise)
], VehicleConversionsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VehicleConversionsController.prototype, "remove", null);
exports.VehicleConversionsController = VehicleConversionsController = __decorate([
    (0, common_1.Controller)('vehicle-conversions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [vehicle_conversions_service_1.VehicleConversionsService])
], VehicleConversionsController);
//# sourceMappingURL=vehicle-conversions.controller.js.map