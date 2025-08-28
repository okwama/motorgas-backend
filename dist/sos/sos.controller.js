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
exports.SosController = void 0;
const common_1 = require("@nestjs/common");
const sos_service_1 = require("./sos.service");
const create_sos_dto_1 = require("./dto/create-sos.dto");
const update_sos_dto_1 = require("./dto/update-sos.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let SosController = class SosController {
    sosService;
    constructor(sosService) {
        this.sosService = sosService;
    }
    async findAll(page = 1, limit = 10) {
        const [sosAlerts, total] = await this.sosService.findAll(page, limit);
        const totalPages = Math.ceil(total / limit);
        return {
            data: sosAlerts,
            total,
            page,
            limit,
            total_pages: totalPages,
        };
    }
    async findActive() {
        const [sosAlerts, total] = await this.sosService.findActive();
        return {
            data: sosAlerts,
            total,
        };
    }
    async findByStaff(staffId) {
        const [sosAlerts, total] = await this.sosService.findByStaff(+staffId);
        return {
            data: sosAlerts,
            total,
        };
    }
    async findOne(id) {
        return this.sosService.findOne(+id);
    }
    async create(createSosDto) {
        return this.sosService.create(createSosDto);
    }
    async update(id, updateSosDto) {
        return this.sosService.update(+id, updateSosDto);
    }
    async remove(id) {
        return this.sosService.remove(+id);
    }
};
exports.SosController = SosController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], SosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('active'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SosController.prototype, "findActive", null);
__decorate([
    (0, common_1.Get)('staff/:staffId'),
    __param(0, (0, common_1.Param)('staffId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SosController.prototype, "findByStaff", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_sos_dto_1.CreateSosDto]),
    __metadata("design:returntype", Promise)
], SosController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_sos_dto_1.UpdateSosDto]),
    __metadata("design:returntype", Promise)
], SosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SosController.prototype, "remove", null);
exports.SosController = SosController = __decorate([
    (0, common_1.Controller)('sos'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [sos_service_1.SosService])
], SosController);
//# sourceMappingURL=sos.controller.js.map