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
exports.StaffController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const staff_entity_1 = require("../entities/staff.entity");
const checkin_record_entity_1 = require("../entities/checkin-record.entity");
let StaffController = class StaffController {
    staffRepository;
    checkinRepository;
    constructor(staffRepository, checkinRepository) {
        this.staffRepository = staffRepository;
        this.checkinRepository = checkinRepository;
    }
    async getAllStaff(req) {
        const currentStaff = await this.staffRepository.findOne({
            where: { id: req.user.userId },
        });
        if (!currentStaff || currentStaff.role !== 'Manager') {
            throw new Error('Unauthorized access - Manager role required');
        }
        const allStaff = await this.staffRepository.find({
            relations: ['station'],
            order: { name: 'ASC' },
        });
        return {
            success: true,
            data: allStaff.map(staff => ({
                id: staff.id,
                name: staff.name,
                phone: staff.phone,
                role: staff.role,
                empl_no: staff.empl_no,
                station_id: staff.station_id,
                station: staff.station,
                photo_url: staff.photo_url,
                status: staff.status,
                created_at: staff.created_at,
            })),
        };
    }
    async getStaffById(id, req) {
        const currentStaff = await this.staffRepository.findOne({
            where: { id: req.user.userId },
        });
        if (!currentStaff) {
            throw new Error('User not found');
        }
        if (currentStaff.role !== 'Manager' && req.user.userId !== id) {
            throw new Error('Unauthorized access');
        }
        const staff = await this.staffRepository.findOne({
            where: { id },
            relations: ['station'],
        });
        if (!staff) {
            throw new Error('Staff not found');
        }
        return {
            id: staff.id,
            name: staff.name,
            phone: staff.phone,
            role: staff.role,
            empl_no: staff.empl_no,
            station_id: staff.station_id,
            station: staff.station,
            photo_url: staff.photo_url,
            status: staff.status,
        };
    }
    async createStaff(staffData, req) {
        const currentStaff = await this.staffRepository.findOne({
            where: { id: req.user.userId },
        });
        if (!currentStaff || currentStaff.role !== 'Manager') {
            throw new Error('Unauthorized access - Manager role required');
        }
        const newStaff = this.staffRepository.create(staffData);
        const savedStaff = await this.staffRepository.save(newStaff);
        return {
            success: true,
            data: savedStaff,
            message: 'Staff created successfully',
        };
    }
    async updateStaff(id, updateData, req) {
        const currentStaff = await this.staffRepository.findOne({
            where: { id: req.user.userId },
        });
        if (!currentStaff) {
            throw new Error('User not found');
        }
        if (currentStaff.role !== 'Manager' && req.user.userId !== id) {
            throw new Error('Unauthorized access');
        }
        let allowedFields = ['name', 'phone', 'photo_url'];
        if (currentStaff.role === 'Manager') {
            allowedFields = ['name', 'phone', 'photo_url', 'role', 'empl_no', 'id_no', 'salary', 'status'];
        }
        const filteredData = Object.keys(updateData)
            .filter(key => allowedFields.includes(key))
            .reduce((obj, key) => {
            obj[key] = updateData[key];
            return obj;
        }, {});
        await this.staffRepository.update(id, filteredData);
        return { success: true, message: 'Staff updated successfully' };
    }
    async getStaffStatistics(id, req) {
        const currentStaff = await this.staffRepository.findOne({
            where: { id: req.user.userId },
        });
        if (!currentStaff) {
            throw new Error('User not found');
        }
        if (currentStaff.role !== 'Manager' && req.user.userId !== id) {
            throw new Error('Unauthorized access');
        }
        const checkinRecords = await this.checkinRepository.find({
            where: { user_id: id },
            order: { time_in: 'DESC' },
        });
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const checkinsThisMonth = checkinRecords.filter(record => new Date(record.time_in) >= startOfMonth).length;
        const todayActivity = checkinRecords.filter(record => new Date(record.time_in) >= startOfDay).length;
        const uniqueStations = new Set(checkinRecords.map(record => record.station_id)).size;
        const totalCheckins = checkinRecords.length;
        const consistencyScore = totalCheckins > 0 ? Math.min(100, Math.round((totalCheckins / 30) * 100)) : 0;
        return {
            days_active: totalCheckins,
            performance_metrics: {
                checkins_this_month: checkinsThisMonth,
                today_activity: todayActivity,
                outlets_visited: uniqueStations,
                consistency_score: consistencyScore,
            },
        };
    }
    async getStaffActivity(id, req) {
        const currentStaff = await this.staffRepository.findOne({
            where: { id: req.user.userId },
        });
        if (!currentStaff) {
            throw new Error('User not found');
        }
        if (currentStaff.role !== 'Manager' && req.user.userId !== id) {
            throw new Error('Unauthorized access');
        }
        const checkinRecords = await this.checkinRepository.find({
            where: { user_id: id },
            relations: ['station'],
            order: { time_in: 'DESC' },
            take: 50,
        });
        return checkinRecords.map(record => ({
            id: record.id,
            checkin_time: record.time_in,
            checkout_time: record.time_out,
            station_name: record.station?.name || record.station_name || 'Unknown Station',
            duration: record.time_out
                ? Math.round((new Date(record.time_out).getTime() - new Date(record.time_in).getTime()) / (1000 * 60 * 60))
                : null,
        }));
    }
    async getStaffPerformance(id, req) {
        const currentStaff = await this.staffRepository.findOne({
            where: { id: req.user.userId },
        });
        if (!currentStaff) {
            throw new Error('User not found');
        }
        if (currentStaff.role !== 'Manager' && req.user.userId !== id) {
            throw new Error('Unauthorized access');
        }
        const checkinRecords = await this.checkinRepository.find({
            where: { user_id: id },
        });
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const checkinsThisMonth = checkinRecords.filter(record => new Date(record.time_in) >= startOfMonth).length;
        const todayActivity = checkinRecords.filter(record => new Date(record.time_in) >= startOfDay).length;
        const uniqueStations = new Set(checkinRecords.map(record => record.station_id)).size;
        const totalCheckins = checkinRecords.length;
        const consistencyScore = totalCheckins > 0 ? Math.min(100, Math.round((totalCheckins / 30) * 100)) : 0;
        const completedCheckins = checkinRecords.filter(record => record.time_out);
        const totalHours = completedCheckins.reduce((sum, record) => {
            const duration = new Date(record.time_out).getTime() - new Date(record.time_in).getTime();
            return sum + (duration / (1000 * 60 * 60));
        }, 0);
        const averageCheckinTime = completedCheckins.length > 0 ? Math.round(totalHours / completedCheckins.length) : 0;
        return {
            checkins_this_month: checkinsThisMonth,
            today_activity: todayActivity,
            outlets_visited: uniqueStations,
            consistency_score: consistencyScore,
            average_checkin_time: averageCheckinTime,
            total_checkins: totalCheckins,
        };
    }
};
exports.StaffController = StaffController;
__decorate([
    (0, common_1.Get)('all'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "getAllStaff", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "getStaffById", null);
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "createStaff", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "updateStaff", null);
__decorate([
    (0, common_1.Get)(':id/statistics'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "getStaffStatistics", null);
__decorate([
    (0, common_1.Get)(':id/activity'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "getStaffActivity", null);
__decorate([
    (0, common_1.Get)(':id/performance'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "getStaffPerformance", null);
exports.StaffController = StaffController = __decorate([
    (0, common_1.Controller)('staff'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, typeorm_1.InjectRepository)(staff_entity_1.Staff)),
    __param(1, (0, typeorm_1.InjectRepository)(checkin_record_entity_1.CheckinRecord)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], StaffController);
//# sourceMappingURL=staff.controller.js.map