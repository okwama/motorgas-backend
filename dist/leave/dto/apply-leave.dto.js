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
exports.ApplyLeaveDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class ApplyLeaveDto {
    leave_type_id;
    start_date;
    end_date;
    is_half_day;
    reason;
    attachment_url;
}
exports.ApplyLeaveDto = ApplyLeaveDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Leave type ID',
        example: 1,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], ApplyLeaveDto.prototype, "leave_type_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Start date of leave',
        example: '2025-07-04',
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ApplyLeaveDto.prototype, "start_date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'End date of leave',
        example: '2025-07-19',
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ApplyLeaveDto.prototype, "end_date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Is half day leave',
        example: false,
        required: false,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], ApplyLeaveDto.prototype, "is_half_day", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Reason for leave',
        example: 'Personal vacation',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ApplyLeaveDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Attachment URL',
        example: '/uploads/leave_document.pdf',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ApplyLeaveDto.prototype, "attachment_url", void 0);
//# sourceMappingURL=apply-leave.dto.js.map