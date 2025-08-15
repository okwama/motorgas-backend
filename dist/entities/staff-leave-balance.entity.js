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
exports.StaffLeaveBalance = void 0;
const typeorm_1 = require("typeorm");
const staff_entity_1 = require("./staff.entity");
const leave_type_entity_1 = require("./leave-type.entity");
let StaffLeaveBalance = class StaffLeaveBalance {
    id;
    staff_id;
    leave_type_id;
    year;
    accrued;
    used;
    carried_forward;
    staff;
    leave_type;
};
exports.StaffLeaveBalance = StaffLeaveBalance;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], StaffLeaveBalance.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], StaffLeaveBalance.prototype, "staff_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], StaffLeaveBalance.prototype, "leave_type_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], StaffLeaveBalance.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 0.00 }),
    __metadata("design:type", Number)
], StaffLeaveBalance.prototype, "accrued", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 0.00 }),
    __metadata("design:type", Number)
], StaffLeaveBalance.prototype, "used", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 0.00 }),
    __metadata("design:type", Number)
], StaffLeaveBalance.prototype, "carried_forward", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => staff_entity_1.Staff, staff => staff.leave_balances),
    (0, typeorm_1.JoinColumn)({ name: 'staff_id' }),
    __metadata("design:type", staff_entity_1.Staff)
], StaffLeaveBalance.prototype, "staff", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => leave_type_entity_1.LeaveType, leaveType => leaveType.leave_balances),
    (0, typeorm_1.JoinColumn)({ name: 'leave_type_id' }),
    __metadata("design:type", leave_type_entity_1.LeaveType)
], StaffLeaveBalance.prototype, "leave_type", void 0);
exports.StaffLeaveBalance = StaffLeaveBalance = __decorate([
    (0, typeorm_1.Entity)('staff_leave_balances')
], StaffLeaveBalance);
//# sourceMappingURL=staff-leave-balance.entity.js.map