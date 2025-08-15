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
exports.CheckinRecord = void 0;
const typeorm_1 = require("typeorm");
const staff_entity_1 = require("./staff.entity");
const station_entity_1 = require("./station.entity");
let CheckinRecord = class CheckinRecord {
    id;
    user_id;
    user_name;
    station_id;
    station_name;
    check_in_latitude;
    check_in_longitude;
    check_out_latitude;
    check_out_longitude;
    address;
    status;
    time_in;
    time_out;
    qr_data;
    created_at;
    updated_at;
    staff;
    station;
};
exports.CheckinRecord = CheckinRecord;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", Number)
], CheckinRecord.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], CheckinRecord.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], CheckinRecord.prototype, "user_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], CheckinRecord.prototype, "station_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], CheckinRecord.prototype, "station_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 8 }),
    __metadata("design:type", Number)
], CheckinRecord.prototype, "check_in_latitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 11, scale: 8 }),
    __metadata("design:type", Number)
], CheckinRecord.prototype, "check_in_longitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 8, nullable: true }),
    __metadata("design:type", Number)
], CheckinRecord.prototype, "check_out_latitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 11, scale: 8, nullable: true }),
    __metadata("design:type", Number)
], CheckinRecord.prototype, "check_out_longitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], CheckinRecord.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], CheckinRecord.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], CheckinRecord.prototype, "time_in", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], CheckinRecord.prototype, "time_out", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], CheckinRecord.prototype, "qr_data", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], CheckinRecord.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], CheckinRecord.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => staff_entity_1.Staff, staff => staff.checkin_records),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", staff_entity_1.Staff)
], CheckinRecord.prototype, "staff", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => station_entity_1.Station),
    (0, typeorm_1.JoinColumn)({ name: 'station_id' }),
    __metadata("design:type", station_entity_1.Station)
], CheckinRecord.prototype, "station", void 0);
exports.CheckinRecord = CheckinRecord = __decorate([
    (0, typeorm_1.Entity)('checkin_records')
], CheckinRecord);
//# sourceMappingURL=checkin-record.entity.js.map