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
exports.CheckinController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
const checkin_service_1 = require("./checkin.service");
const checkin_dto_1 = require("./dto/checkin.dto");
const checkout_dto_1 = require("./dto/checkout.dto");
let CheckinController = class CheckinController {
    checkinService;
    constructor(checkinService) {
        this.checkinService = checkinService;
    }
    async checkin(req, checkinDto) {
        return this.checkinService.checkin(req.user.userId, checkinDto);
    }
    async checkout(req, checkoutDto) {
        return this.checkinService.checkout(req.user.userId, checkoutDto);
    }
    async getStatus(req) {
        return this.checkinService.getCheckinStatus(req.user.userId);
    }
    async getHistory(req, page = 1, limit = 10) {
        return this.checkinService.getCheckinHistory(req.user.userId, page, limit);
    }
    async getAllCheckins(page = 1, limit = 10) {
        return this.checkinService.getAllCheckins(page, limit);
    }
};
exports.CheckinController = CheckinController;
__decorate([
    (0, common_1.Post)('checkin'),
    (0, swagger_1.ApiOperation)({ summary: 'Check in to a station' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Check-in successful' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Already checked in' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Staff or station not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, checkin_dto_1.CheckinDto]),
    __metadata("design:returntype", Promise)
], CheckinController.prototype, "checkin", null);
__decorate([
    (0, common_1.Post)('checkout'),
    (0, swagger_1.ApiOperation)({ summary: 'Check out from current station' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Check-out successful' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'No active check-in found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, checkout_dto_1.CheckoutDto]),
    __metadata("design:returntype", Promise)
], CheckinController.prototype, "checkout", null);
__decorate([
    (0, common_1.Get)('status'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current check-in status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Status retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CheckinController.prototype, "getStatus", null);
__decorate([
    (0, common_1.Get)('history'),
    (0, swagger_1.ApiOperation)({ summary: 'Get check-in history for current user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'History retrieved successfully' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], CheckinController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all check-in records (admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Records retrieved successfully' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], CheckinController.prototype, "getAllCheckins", null);
exports.CheckinController = CheckinController = __decorate([
    (0, swagger_1.ApiTags)('Check-in/Check-out'),
    (0, common_1.Controller)('checkin'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [checkin_service_1.CheckinService])
], CheckinController);
//# sourceMappingURL=checkin.controller.js.map