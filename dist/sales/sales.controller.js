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
exports.SalesController = void 0;
const common_1 = require("@nestjs/common");
const sales_service_1 = require("./sales.service");
const create_sale_dto_1 = require("./dto/create-sale.dto");
const create_walkin_client_dto_1 = require("./dto/create-walkin-client.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let SalesController = class SalesController {
    salesService;
    constructor(salesService) {
        this.salesService = salesService;
    }
    async createSale(createSaleDto, req) {
        const staffId = req.user?.userId || req.user?.id;
        console.log('🔍 Creating sale for staff ID:', staffId);
        if (!staffId || isNaN(staffId) || staffId <= 0) {
            throw new common_1.UnauthorizedException('Invalid or missing staff ID in token');
        }
        return this.salesService.createSale(createSaleDto, Number(staffId));
    }
    async createWalkInClient(createWalkInClientDto) {
        return this.salesService.createWalkInClient(createWalkInClientDto);
    }
    async getSalesByStation(stationId) {
        return this.salesService.getSalesByStation(+stationId);
    }
    async getSalesByClient(clientId) {
        return this.salesService.getSalesByClient(+clientId);
    }
    async getMySales(req) {
        const staffId = req.user?.userId || req.user?.id;
        console.log('🔍 JWT user data:', req.user);
        console.log('🔍 Staff ID from token:', staffId, 'Type:', typeof staffId);
        if (!staffId || isNaN(staffId) || staffId <= 0) {
            throw new common_1.UnauthorizedException('Invalid or missing staff ID in token');
        }
        return this.salesService.getSalesByStaff(Number(staffId));
    }
    async getSalesByStaff(staffId) {
        return this.salesService.getSalesByStaff(+staffId);
    }
    async getPumpsByStation(stationId) {
        return this.salesService.getPumpsByStation(+stationId);
    }
    async getKeyAccountClients() {
        return this.salesService.getKeyAccountClients();
    }
    async getWalkInClients() {
        return this.salesService.getWalkInClients();
    }
    async getStationCurrentPrice(stationId) {
        const price = await this.salesService.getStationCurrentPrice(+stationId);
        return { current_price: price };
    }
    async getSaleById(id) {
        return this.salesService.getSaleById(+id);
    }
};
exports.SalesController = SalesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_sale_dto_1.CreateSaleDto, Object]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "createSale", null);
__decorate([
    (0, common_1.Post)('walkin-client'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_walkin_client_dto_1.CreateWalkInClientDto]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "createWalkInClient", null);
__decorate([
    (0, common_1.Get)('station/:stationId'),
    __param(0, (0, common_1.Param)('stationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "getSalesByStation", null);
__decorate([
    (0, common_1.Get)('client/:clientId'),
    __param(0, (0, common_1.Param)('clientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "getSalesByClient", null);
__decorate([
    (0, common_1.Get)('my-sales'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "getMySales", null);
__decorate([
    (0, common_1.Get)('staff/:staffId'),
    __param(0, (0, common_1.Param)('staffId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "getSalesByStaff", null);
__decorate([
    (0, common_1.Get)('pumps/station/:stationId'),
    __param(0, (0, common_1.Param)('stationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "getPumpsByStation", null);
__decorate([
    (0, common_1.Get)('clients/key-accounts'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "getKeyAccountClients", null);
__decorate([
    (0, common_1.Get)('clients/walk-in'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "getWalkInClients", null);
__decorate([
    (0, common_1.Get)('station/:stationId/price'),
    __param(0, (0, common_1.Param)('stationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "getStationCurrentPrice", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "getSaleById", null);
exports.SalesController = SalesController = __decorate([
    (0, common_1.Controller)('sales'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [sales_service_1.SalesService])
], SalesController);
//# sourceMappingURL=sales.controller.js.map