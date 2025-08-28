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
exports.VehicleConversion = exports.ConversionType = void 0;
const typeorm_1 = require("typeorm");
var ConversionType;
(function (ConversionType) {
    ConversionType["FULL"] = "Full";
    ConversionType["PARTIAL"] = "Partial";
})(ConversionType || (exports.ConversionType = ConversionType = {}));
let VehicleConversion = class VehicleConversion {
    id;
    vehiclePlate;
    vehicleType;
    conversionType;
    amountCharged;
    serviceDate;
    comment;
    createdAt;
};
exports.VehicleConversion = VehicleConversion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], VehicleConversion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'vehicle_plate', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], VehicleConversion.prototype, "vehiclePlate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'vehicle_type', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], VehicleConversion.prototype, "vehicleType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'conversion_type',
        type: 'varchar',
        length: 100,
        enum: ConversionType
    }),
    __metadata("design:type", String)
], VehicleConversion.prototype, "conversionType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'amount_charged',
        type: 'decimal',
        precision: 10,
        scale: 2
    }),
    __metadata("design:type", Number)
], VehicleConversion.prototype, "amountCharged", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'service_date',
        type: 'date'
    }),
    __metadata("design:type", Date)
], VehicleConversion.prototype, "serviceDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'comment',
        type: 'text',
        nullable: true
    }),
    __metadata("design:type", String)
], VehicleConversion.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], VehicleConversion.prototype, "createdAt", void 0);
exports.VehicleConversion = VehicleConversion = __decorate([
    (0, typeorm_1.Entity)('vehicle_conversions')
], VehicleConversion);
//# sourceMappingURL=vehicle-conversion.entity.js.map