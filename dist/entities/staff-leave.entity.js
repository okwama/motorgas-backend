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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffLeave = exports.LeaveStatus = void 0;
const typeorm_1 = require("typeorm");
const staff_entity_1 = require("./staff.entity");
const leave_type_entity_1 = require("./leave-type.entity");
var LeaveStatus;
(function (LeaveStatus) {
    LeaveStatus["PENDING"] = "pending";
    LeaveStatus["APPROVED"] = "approved";
    LeaveStatus["REJECTED"] = "rejected";
})(LeaveStatus || (exports.LeaveStatus = LeaveStatus = {}));
let StaffLeave = class StaffLeave {
    id;
    staff_id;
    leave_type_id;
    start_date;
    end_date;
    is_half_day;
    reason;
    status;
    approved_by;
    attachment_url;
    applied_at;
    updated_at;
    staff;
    leave_type;
    approver;
};
exports.StaffLeave = StaffLeave;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], StaffLeave.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], StaffLeave.prototype, "staff_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], StaffLeave.prototype, "leave_type_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], StaffLeave.prototype, "start_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], StaffLeave.prototype, "end_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint', default: 0 }),
    __metadata("design:type", Number)
], StaffLeave.prototype, "is_half_day", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], StaffLeave.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 20,
        default: LeaveStatus.PENDING
    }),
    __metadata("design:type", String)
], StaffLeave.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], StaffLeave.prototype, "approved_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], StaffLeave.prototype, "attachment_url", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], StaffLeave.prototype, "applied_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], StaffLeave.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => staff_entity_1.Staff, staff => staff.leaves),
    (0, typeorm_1.JoinColumn)({ name: 'staff_id' }),
    __metadata("design:type", staff_entity_1.Staff)
], StaffLeave.prototype, "staff", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => leave_type_entity_1.LeaveType, leaveType => leaveType.leaves),
    (0, typeorm_1.JoinColumn)({ name: 'leave_type_id' }),
    __metadata("design:type", leave_type_entity_1.LeaveType)
], StaffLeave.prototype, "leave_type", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => staff_entity_1.Staff),
    (0, typeorm_1.JoinColumn)({ name: 'approved_by' }),
    __metadata("design:type", staff_entity_1.Staff)
], StaffLeave.prototype, "approver", void 0);
exports.StaffLeave = StaffLeave = __decorate([
    (0, typeorm_1.Entity)('staff_leaves')
], StaffLeave);
//# sourceMappingURL=staff-leave.entity.js.map