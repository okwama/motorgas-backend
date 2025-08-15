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
exports.Token = void 0;
const typeorm_1 = require("typeorm");
const staff_entity_1 = require("./staff.entity");
let Token = class Token {
    id;
    staff_id;
    access_token;
    refresh_token;
    expires_at;
    created_at;
    updated_at;
    is_valid;
    last_used_at;
    device_info;
    ip_address;
    device_id;
    user_agent;
    device_type;
    app_version;
    refresh_count;
    refresh_expires_at;
    is_primary;
    location_info;
    staff;
};
exports.Token = Token;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Token.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Token.prototype, "staff_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Token.prototype, "access_token", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Token.prototype, "refresh_token", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', precision: 3 }),
    __metadata("design:type", Date)
], Token.prototype, "expires_at", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'datetime', precision: 3 }),
    __metadata("design:type", Date)
], Token.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'datetime', precision: 3 }),
    __metadata("design:type", Date)
], Token.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint', default: 1 }),
    __metadata("design:type", Number)
], Token.prototype, "is_valid", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', precision: 3, default: () => 'CURRENT_TIMESTAMP(3)' }),
    __metadata("design:type", Date)
], Token.prototype, "last_used_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Token.prototype, "device_info", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 45, nullable: true }),
    __metadata("design:type", String)
], Token.prototype, "ip_address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Token.prototype, "device_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Token.prototype, "user_agent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Token.prototype, "device_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Token.prototype, "app_version", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Token.prototype, "refresh_count", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', precision: 3, nullable: true }),
    __metadata("design:type", Date)
], Token.prototype, "refresh_expires_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint', default: 0 }),
    __metadata("design:type", Number)
], Token.prototype, "is_primary", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Token.prototype, "location_info", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => staff_entity_1.Staff, staff => staff.tokens),
    (0, typeorm_1.JoinColumn)({ name: 'staff_id' }),
    __metadata("design:type", staff_entity_1.Staff)
], Token.prototype, "staff", void 0);
exports.Token = Token = __decorate([
    (0, typeorm_1.Entity)('tokens'),
    (0, typeorm_1.Index)(['staff_id', 'is_valid']),
    (0, typeorm_1.Index)(['refresh_token', 'is_valid']),
    (0, typeorm_1.Index)(['access_token'])
], Token);
//# sourceMappingURL=token.entity.js.map