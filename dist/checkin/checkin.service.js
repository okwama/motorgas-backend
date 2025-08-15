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
exports.CheckinService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const checkin_record_entity_1 = require("../entities/checkin-record.entity");
const staff_entity_1 = require("../entities/staff.entity");
const station_entity_1 = require("../entities/station.entity");
let CheckinService = class CheckinService {
    checkinRepository;
    staffRepository;
    stationRepository;
    constructor(checkinRepository, staffRepository, stationRepository) {
        this.checkinRepository = checkinRepository;
        this.staffRepository = staffRepository;
        this.stationRepository = stationRepository;
    }
    async checkin(userId, checkinDto) {
        const { station_id, latitude, longitude, address, qr_data } = checkinDto;
        const staff = await this.staffRepository.findOne({
            where: { id: userId },
            relations: ['station'],
        });
        if (!staff) {
            throw new common_1.NotFoundException('Staff member not found');
        }
        const station = await this.stationRepository.findOne({
            where: { id: station_id },
        });
        if (!station) {
            throw new common_1.NotFoundException('Station not found');
        }
        const existingCheckin = await this.checkinRepository.findOne({
            where: {
                user_id: userId,
                status: 1,
            },
        });
        if (existingCheckin) {
            throw new common_1.BadRequestException('Already checked in');
        }
        const checkinRecord = this.checkinRepository.create({
            user_id: userId,
            user_name: staff.name,
            station_id,
            station_name: station.name,
            check_in_latitude: latitude,
            check_in_longitude: longitude,
            address,
            qr_data,
            status: 1,
            time_in: new Date(),
        });
        const savedRecord = await this.checkinRepository.save(checkinRecord);
        return {
            success: true,
            message: 'Check-in successful',
            data: savedRecord,
        };
    }
    async checkout(userId, checkoutDto) {
        const { latitude, longitude } = checkoutDto;
        const checkinRecord = await this.checkinRepository.findOne({
            where: {
                user_id: userId,
                status: 1,
            },
        });
        if (!checkinRecord) {
            throw new common_1.BadRequestException('No active check-in found');
        }
        checkinRecord.check_out_latitude = latitude;
        checkinRecord.check_out_longitude = longitude;
        checkinRecord.status = 0;
        checkinRecord.time_out = new Date();
        const updatedRecord = await this.checkinRepository.save(checkinRecord);
        return {
            success: true,
            message: 'Check-out successful',
            data: updatedRecord,
        };
    }
    async getCheckinStatus(userId) {
        const activeCheckin = await this.checkinRepository.findOne({
            where: {
                user_id: userId,
                status: 1,
            },
            relations: ['station'],
        });
        return {
            is_checked_in: !!activeCheckin,
            checkin_record: activeCheckin,
        };
    }
    async getCheckinHistory(userId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [records, total] = await this.checkinRepository.findAndCount({
            where: { user_id: userId },
            relations: ['station'],
            order: { created_at: 'DESC' },
            skip,
            take: limit,
        });
        return {
            data: records,
            total,
            page,
            limit,
            total_pages: Math.ceil(total / limit),
        };
    }
    async getAllCheckins(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [records, total] = await this.checkinRepository.findAndCount({
            relations: ['station', 'staff'],
            order: { created_at: 'DESC' },
            skip,
            take: limit,
        });
        return {
            data: records,
            total,
            page,
            limit,
            total_pages: Math.ceil(total / limit),
        };
    }
};
exports.CheckinService = CheckinService;
exports.CheckinService = CheckinService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(checkin_record_entity_1.CheckinRecord)),
    __param(1, (0, typeorm_1.InjectRepository)(staff_entity_1.Staff)),
    __param(2, (0, typeorm_1.InjectRepository)(station_entity_1.Station)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CheckinService);
//# sourceMappingURL=checkin.service.js.map