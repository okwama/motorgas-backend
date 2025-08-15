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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoticeController = void 0;
const common_1 = require("@nestjs/common");
const notice_service_1 = require("./notice.service");
const create_notice_dto_1 = require("./dto/create-notice.dto");
const update_notice_dto_1 = require("./dto/update-notice.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let NoticeController = class NoticeController {
    noticeService;
    constructor(noticeService) {
        this.noticeService = noticeService;
    }
    async findAll(page = 1, limit = 10) {
        const [notices, total] = await this.noticeService.findAll(page, limit);
        const totalPages = Math.ceil(total / limit);
        return {
            data: notices,
            total,
            page,
            limit,
            total_pages: totalPages,
        };
    }
    async findOne(id) {
        return this.noticeService.findOne(+id);
    }
    async create(createNoticeDto) {
        return this.noticeService.create(createNoticeDto);
    }
    async update(id, updateNoticeDto) {
        return this.noticeService.update(+id, updateNoticeDto);
    }
    async remove(id) {
        return this.noticeService.remove(+id);
    }
};
exports.NoticeController = NoticeController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], NoticeController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NoticeController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_notice_dto_1.CreateNoticeDto]),
    __metadata("design:returntype", Promise)
], NoticeController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_notice_dto_1.UpdateNoticeDto]),
    __metadata("design:returntype", Promise)
], NoticeController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NoticeController.prototype, "remove", null);
exports.NoticeController = NoticeController = __decorate([
    (0, common_1.Controller)('notice-board'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [notice_service_1.NoticeService])
], NoticeController);
//# sourceMappingURL=notice.controller.js.map