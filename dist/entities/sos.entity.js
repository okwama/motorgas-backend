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
exports.Sos = void 0;
const typeorm_1 = require("typeorm");
let Sos = class Sos {
    id;
    sos_type;
    latitude;
    longitude;
    status;
    guard_name;
    comment;
    guard_id;
    created_at;
    updated_at;
};
exports.Sos = Sos;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Sos.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 191, default: 'sos' }),
    __metadata("design:type", String)
], Sos.prototype, "sos_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double' }),
    __metadata("design:type", Number)
], Sos.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double' }),
    __metadata("design:type", Number)
], Sos.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 191, default: 'active' }),
    __metadata("design:type", String)
], Sos.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Sos.prototype, "guard_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Sos.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Sos.prototype, "guard_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Sos.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Sos.prototype, "updated_at", void 0);
exports.Sos = Sos = __decorate([
    (0, typeorm_1.Entity)('sos')
], Sos);
//# sourceMappingURL=sos.entity.js.map