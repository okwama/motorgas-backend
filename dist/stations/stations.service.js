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
exports.StationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const station_entity_1 = require("../entities/station.entity");
let StationsService = class StationsService {
    stationRepository;
    constructor(stationRepository) {
        this.stationRepository = stationRepository;
    }
    async findAll(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [stations, total] = await this.stationRepository.findAndCount({
            skip,
            take: limit,
            order: {
                created_at: 'DESC',
            },
        });
        return [stations, total];
    }
    async findOne(id) {
        const station = await this.stationRepository.findOne({ where: { id } });
        if (!station) {
            throw new common_1.NotFoundException(`Station with ID ${id} not found`);
        }
        return station;
    }
    async create(createStationDto) {
        const station = this.stationRepository.create(createStationDto);
        return this.stationRepository.save(station);
    }
    async update(id, updateStationDto) {
        const station = await this.findOne(id);
        Object.assign(station, updateStationDto);
        return this.stationRepository.save(station);
    }
    async remove(id) {
        const station = await this.findOne(id);
        await this.stationRepository.remove(station);
    }
};
exports.StationsService = StationsService;
exports.StationsService = StationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(station_entity_1.Station)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], StationsService);
//# sourceMappingURL=stations.service.js.map