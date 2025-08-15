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
exports.LeaveType = void 0;
const typeorm_1 = require("typeorm");
const staff_leave_entity_1 = require("./staff-leave.entity");
const staff_leave_balance_entity_1 = require("./staff-leave-balance.entity");
let LeaveType = class LeaveType {
    id;
    name;
    description;
    default_days;
    is_active;
    created_at;
    updated_at;
    leaves;
    leave_balances;
};
exports.LeaveType = LeaveType;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], LeaveType.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, unique: true }),
    __metadata("design:type", String)
], LeaveType.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], LeaveType.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], LeaveType.prototype, "default_days", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint', default: 1 }),
    __metadata("design:type", Number)
], LeaveType.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], LeaveType.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], LeaveType.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => staff_leave_entity_1.StaffLeave, leave => leave.leave_type),
    __metadata("design:type", Array)
], LeaveType.prototype, "leaves", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => staff_leave_balance_entity_1.StaffLeaveBalance, balance => balance.leave_type),
    __metadata("design:type", Array)
], LeaveType.prototype, "leave_balances", void 0);
exports.LeaveType = LeaveType = __decorate([
    (0, typeorm_1.Entity)('leave_types')
], LeaveType);
//# sourceMappingURL=leave-type.entity.js.map