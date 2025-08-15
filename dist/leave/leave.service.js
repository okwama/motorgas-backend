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
exports.LeaveService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const staff_leave_entity_1 = require("../entities/staff-leave.entity");
const staff_leave_balance_entity_1 = require("../entities/staff-leave-balance.entity");
const leave_type_entity_1 = require("../entities/leave-type.entity");
const staff_entity_1 = require("../entities/staff.entity");
let LeaveService = class LeaveService {
    staffLeaveRepository;
    staffLeaveBalanceRepository;
    leaveTypeRepository;
    staffRepository;
    constructor(staffLeaveRepository, staffLeaveBalanceRepository, leaveTypeRepository, staffRepository) {
        this.staffLeaveRepository = staffLeaveRepository;
        this.staffLeaveBalanceRepository = staffLeaveBalanceRepository;
        this.leaveTypeRepository = leaveTypeRepository;
        this.staffRepository = staffRepository;
    }
    async applyLeave(userId, applyLeaveDto) {
        const { leave_type_id, start_date, end_date, is_half_day, reason, attachment_url } = applyLeaveDto;
        const staff = await this.staffRepository.findOne({
            where: { id: userId },
        });
        if (!staff) {
            throw new common_1.NotFoundException('Staff member not found');
        }
        const leaveType = await this.leaveTypeRepository.findOne({
            where: { id: leave_type_id },
        });
        if (!leaveType) {
            throw new common_1.NotFoundException('Leave type not found');
        }
        const overlappingLeave = await this.staffLeaveRepository.findOne({
            where: {
                staff_id: userId,
                status: staff_leave_entity_1.LeaveStatus.APPROVED,
                start_date: new Date(start_date),
                end_date: new Date(end_date),
            },
        });
        if (overlappingLeave) {
            throw new common_1.BadRequestException('Leave period overlaps with existing approved leave');
        }
        const leaveApplication = this.staffLeaveRepository.create({
            staff_id: userId,
            leave_type_id,
            start_date: new Date(start_date),
            end_date: new Date(end_date),
            is_half_day: is_half_day ? 1 : 0,
            reason,
            attachment_url,
            status: staff_leave_entity_1.LeaveStatus.PENDING,
        });
        const savedLeave = await this.staffLeaveRepository.save(leaveApplication);
        return {
            success: true,
            message: 'Leave application submitted successfully',
            data: savedLeave,
        };
    }
    async approveLeave(approverId, leaveId, approveLeaveDto) {
        const { status, comments } = approveLeaveDto;
        const leaveApplication = await this.staffLeaveRepository.findOne({
            where: { id: leaveId },
            relations: ['staff', 'leave_type'],
        });
        if (!leaveApplication) {
            throw new common_1.NotFoundException('Leave application not found');
        }
        if (leaveApplication.status !== staff_leave_entity_1.LeaveStatus.PENDING) {
            throw new common_1.BadRequestException('Leave application already processed');
        }
        leaveApplication.status = status === 'approved' ? staff_leave_entity_1.LeaveStatus.APPROVED : staff_leave_entity_1.LeaveStatus.REJECTED;
        leaveApplication.approved_by = approverId;
        leaveApplication.updated_at = new Date();
        const updatedLeave = await this.staffLeaveRepository.save(leaveApplication);
        if (status === 'approved') {
            await this.updateLeaveBalance(leaveApplication.staff_id, leaveApplication.leave_type_id);
        }
        return {
            success: true,
            message: `Leave application ${status}`,
            data: updatedLeave,
        };
    }
    async getLeaveApplications(userId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [applications, total] = await this.staffLeaveRepository.findAndCount({
            where: { staff_id: userId },
            relations: ['leave_type', 'approver'],
            order: { applied_at: 'DESC' },
            skip,
            take: limit,
        });
        return {
            data: applications,
            total,
            page,
            limit,
            total_pages: Math.ceil(total / limit),
        };
    }
    async getAllLeaveApplications(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [applications, total] = await this.staffLeaveRepository.findAndCount({
            relations: ['staff', 'leave_type', 'approver'],
            order: { applied_at: 'DESC' },
            skip,
            take: limit,
        });
        return {
            data: applications,
            total,
            page,
            limit,
            total_pages: Math.ceil(total / limit),
        };
    }
    async getLeaveBalance(userId) {
        const balances = await this.staffLeaveBalanceRepository.find({
            where: { staff_id: userId },
            relations: ['leave_type'],
        });
        return {
            data: balances,
        };
    }
    async getLeaveTypes() {
        const leaveTypes = await this.leaveTypeRepository.find({
            where: { is_active: 1 },
            order: { name: 'ASC' },
        });
        return {
            data: leaveTypes,
        };
    }
    async updateLeaveBalance(staffId, leaveTypeId) {
        const currentYear = new Date().getFullYear();
        let balance = await this.staffLeaveBalanceRepository.findOne({
            where: {
                staff_id: staffId,
                leave_type_id: leaveTypeId,
                year: currentYear,
            },
        });
        if (!balance) {
            balance = this.staffLeaveBalanceRepository.create({
                staff_id: staffId,
                leave_type_id: leaveTypeId,
                year: currentYear,
                accrued: 0,
                used: 0,
                carried_forward: 0,
            });
        }
        balance.used += 1;
        await this.staffLeaveBalanceRepository.save(balance);
    }
};
exports.LeaveService = LeaveService;
exports.LeaveService = LeaveService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(staff_leave_entity_1.StaffLeave)),
    __param(1, (0, typeorm_1.InjectRepository)(staff_leave_balance_entity_1.StaffLeaveBalance)),
    __param(2, (0, typeorm_1.InjectRepository)(leave_type_entity_1.LeaveType)),
    __param(3, (0, typeorm_1.InjectRepository)(staff_entity_1.Staff)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], LeaveService);
//# sourceMappingURL=leave.service.js.map