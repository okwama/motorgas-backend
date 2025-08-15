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
exports.StationsController = void 0;
const common_1 = require("@nestjs/common");
const stations_service_1 = require("./stations.service");
const create_station_dto_1 = require("./dto/create-station.dto");
const update_station_dto_1 = require("./dto/update-station.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let StationsController = class StationsController {
    stationsService;
    constructor(stationsService) {
        this.stationsService = stationsService;
    }
    async findAll(page = 1, limit = 10) {
        const [stations, total] = await this.stationsService.findAll(page, limit);
        const totalPages = Math.ceil(total / limit);
        return {
            data: stations,
            total,
            page,
            limit,
            total_pages: totalPages,
        };
    }
    async findOne(id) {
        return this.stationsService.findOne(+id);
    }
    async create(createStationDto) {
        return this.stationsService.create(createStationDto);
    }
    async update(id, updateStationDto) {
        return this.stationsService.update(+id, updateStationDto);
    }
    async remove(id) {
        return this.stationsService.remove(+id);
    }
};
exports.StationsController = StationsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], StationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_station_dto_1.CreateStationDto]),
    __metadata("design:returntype", Promise)
], StationsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_station_dto_1.UpdateStationDto]),
    __metadata("design:returntype", Promise)
], StationsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StationsController.prototype, "remove", null);
exports.StationsController = StationsController = __decorate([
    (0, common_1.Controller)('stations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [stations_service_1.StationsService])
], StationsController);
//# sourceMappingURL=stations.controller.js.map