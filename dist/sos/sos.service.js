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
exports.SosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sos_entity_1 = require("../entities/sos.entity");
let SosService = class SosService {
    sosRepository;
    constructor(sosRepository) {
        this.sosRepository = sosRepository;
    }
    async findAll(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [sosAlerts, total] = await this.sosRepository.findAndCount({
            skip,
            take: limit,
            order: {
                created_at: 'DESC',
            },
        });
        return [sosAlerts, total];
    }
    async findActive() {
        const [sosAlerts, total] = await this.sosRepository.findAndCount({
            where: { status: 'active' },
            order: {
                created_at: 'DESC',
            },
        });
        return [sosAlerts, total];
    }
    async findByGuard(guardId) {
        const [sosAlerts, total] = await this.sosRepository.findAndCount({
            where: { guard_id: guardId },
            order: {
                created_at: 'DESC',
            },
        });
        return [sosAlerts, total];
    }
    async findOne(id) {
        const sosAlert = await this.sosRepository.findOne({ where: { id } });
        if (!sosAlert) {
            throw new common_1.NotFoundException(`SOS alert with ID ${id} not found`);
        }
        return sosAlert;
    }
    async create(createSosDto) {
        const sosAlert = this.sosRepository.create(createSosDto);
        return this.sosRepository.save(sosAlert);
    }
    async update(id, updateSosDto) {
        const sosAlert = await this.findOne(id);
        Object.assign(sosAlert, updateSosDto);
        return this.sosRepository.save(sosAlert);
    }
    async remove(id) {
        const sosAlert = await this.findOne(id);
        await this.sosRepository.remove(sosAlert);
    }
};
exports.SosService = SosService;
exports.SosService = SosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sos_entity_1.Sos)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SosService);
//# sourceMappingURL=sos.service.js.map