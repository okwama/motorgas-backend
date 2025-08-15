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
exports.LeaveController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
const leave_service_1 = require("./leave.service");
const apply_leave_dto_1 = require("./dto/apply-leave.dto");
const approve_leave_dto_1 = require("./dto/approve-leave.dto");
let LeaveController = class LeaveController {
    leaveService;
    constructor(leaveService) {
        this.leaveService = leaveService;
    }
    async applyLeave(req, applyLeaveDto) {
        return this.leaveService.applyLeave(req.user.userId, applyLeaveDto);
    }
    async approveLeave(req, leaveId, approveLeaveDto) {
        return this.leaveService.approveLeave(req.user.userId, leaveId, approveLeaveDto);
    }
    async getLeaveApplications(req, page = 1, limit = 10) {
        return this.leaveService.getLeaveApplications(req.user.userId, page, limit);
    }
    async getAllLeaveApplications(page = 1, limit = 10) {
        return this.leaveService.getAllLeaveApplications(page, limit);
    }
    async getLeaveBalance(req) {
        return this.leaveService.getLeaveBalance(req.user.userId);
    }
    async getLeaveTypes() {
        return this.leaveService.getLeaveTypes();
    }
};
exports.LeaveController = LeaveController;
__decorate([
    (0, common_1.Post)('apply'),
    (0, swagger_1.ApiOperation)({ summary: 'Apply for leave' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Leave application submitted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid request or overlapping leave' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Staff or leave type not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, apply_leave_dto_1.ApplyLeaveDto]),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "applyLeave", null);
__decorate([
    (0, common_1.Put)('approve/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve or reject leave application' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Leave application processed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid request or already processed' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Leave application not found' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Leave application ID' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, approve_leave_dto_1.ApproveLeaveDto]),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "approveLeave", null);
__decorate([
    (0, common_1.Get)('applications'),
    (0, swagger_1.ApiOperation)({ summary: 'Get leave applications for current user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Applications retrieved successfully' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "getLeaveApplications", null);
__decorate([
    (0, common_1.Get)('applications/all'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all leave applications (admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Applications retrieved successfully' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "getAllLeaveApplications", null);
__decorate([
    (0, common_1.Get)('balance'),
    (0, swagger_1.ApiOperation)({ summary: 'Get leave balance for current user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Balance retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "getLeaveBalance", null);
__decorate([
    (0, common_1.Get)('types'),
    (0, swagger_1.ApiOperation)({ summary: 'Get available leave types' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Leave types retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "getLeaveTypes", null);
exports.LeaveController = LeaveController = __decorate([
    (0, swagger_1.ApiTags)('Leave Management'),
    (0, common_1.Controller)('leave'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [leave_service_1.LeaveService])
], LeaveController);
//# sourceMappingURL=leave.controller.js.map