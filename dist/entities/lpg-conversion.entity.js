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
exports.LpgConversion = exports.ConversionType = void 0;
const typeorm_1 = require("typeorm");
const staff_entity_1 = require("./staff.entity");
const station_entity_1 = require("./station.entity");
var ConversionType;
(function (ConversionType) {
    ConversionType["COMPLETE"] = "complete";
    ConversionType["PARTIAL"] = "partial";
})(ConversionType || (exports.ConversionType = ConversionType = {}));
let LpgConversion = class LpgConversion {
    id;
    carRegistration;
    carModel;
    conversionType;
    notes;
    stationId;
    staffId;
    conversionDate;
    createdAt;
    updatedAt;
    staff;
    station;
};
exports.LpgConversion = LpgConversion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], LpgConversion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'car_registration', length: 20 }),
    __metadata("design:type", String)
], LpgConversion.prototype, "carRegistration", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'car_model', length: 100 }),
    __metadata("design:type", String)
], LpgConversion.prototype, "carModel", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'conversion_type',
        type: 'enum',
        enum: ConversionType,
        default: ConversionType.COMPLETE,
    }),
    __metadata("design:type", String)
], LpgConversion.prototype, "conversionType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], LpgConversion.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'station_id' }),
    __metadata("design:type", Number)
], LpgConversion.prototype, "stationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'staff_id' }),
    __metadata("design:type", Number)
], LpgConversion.prototype, "staffId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'conversion_date', type: 'date' }),
    __metadata("design:type", Date)
], LpgConversion.prototype, "conversionDate", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], LpgConversion.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], LpgConversion.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => staff_entity_1.Staff, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'staff_id' }),
    __metadata("design:type", staff_entity_1.Staff)
], LpgConversion.prototype, "staff", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => station_entity_1.Station, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'station_id' }),
    __metadata("design:type", station_entity_1.Station)
], LpgConversion.prototype, "station", void 0);
exports.LpgConversion = LpgConversion = __decorate([
    (0, typeorm_1.Entity)('lpg_conversions')
], LpgConversion);
//# sourceMappingURL=lpg-conversion.entity.js.map