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
exports.Staff = void 0;
const typeorm_1 = require("typeorm");
const station_entity_1 = require("./station.entity");
const staff_leave_entity_1 = require("./staff-leave.entity");
const staff_leave_balance_entity_1 = require("./staff-leave-balance.entity");
const checkin_record_entity_1 = require("./checkin-record.entity");
const token_entity_1 = require("./token.entity");
let Staff = class Staff {
    id;
    name;
    phone;
    password;
    role_id;
    role;
    station_id;
    empl_no;
    id_no;
    photo_url;
    status;
    created_at;
    station;
    leaves;
    leave_balances;
    checkin_records;
    tokens;
};
exports.Staff = Staff;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Staff.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200 }),
    __metadata("design:type", String)
], Staff.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], Staff.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Staff.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Staff.prototype, "role_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200 }),
    __metadata("design:type", String)
], Staff.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Staff.prototype, "station_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, unique: true }),
    __metadata("design:type", String)
], Staff.prototype, "empl_no", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Staff.prototype, "id_no", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", String)
], Staff.prototype, "photo_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Staff.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'datetime', precision: 3, nullable: true }),
    __metadata("design:type", Date)
], Staff.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => station_entity_1.Station, station => station.staff),
    (0, typeorm_1.JoinColumn)({ name: 'station_id' }),
    __metadata("design:type", station_entity_1.Station)
], Staff.prototype, "station", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => staff_leave_entity_1.StaffLeave, leave => leave.staff),
    __metadata("design:type", Array)
], Staff.prototype, "leaves", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => staff_leave_balance_entity_1.StaffLeaveBalance, balance => balance.staff),
    __metadata("design:type", Array)
], Staff.prototype, "leave_balances", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => checkin_record_entity_1.CheckinRecord, checkin => checkin.staff),
    __metadata("design:type", Array)
], Staff.prototype, "checkin_records", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => token_entity_1.Token, token => token.staff),
    __metadata("design:type", Array)
], Staff.prototype, "tokens", void 0);
exports.Staff = Staff = __decorate([
    (0, typeorm_1.Entity)('staff')
], Staff);
//# sourceMappingURL=staff.entity.js.map