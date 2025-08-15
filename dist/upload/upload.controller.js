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
exports.UploadController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const upload_service_1 = require("./upload.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let UploadController = class UploadController {
    uploadService;
    constructor(uploadService) {
        this.uploadService = uploadService;
    }
    async uploadProfileImage(file) {
        if (!file) {
            throw new common_1.BadRequestException('No file uploaded');
        }
        try {
            const imageUrl = await this.uploadService.uploadProfileImage(file);
            return {
                success: true,
                data: {
                    url: imageUrl,
                    filename: file.originalname,
                    size: file.size,
                },
                message: 'Profile image uploaded successfully',
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async uploadLeaveDocument(file) {
        if (!file) {
            throw new common_1.BadRequestException('No file uploaded');
        }
        try {
            const documentUrl = await this.uploadService.uploadLeaveDocument(file);
            return {
                success: true,
                data: {
                    url: documentUrl,
                    filename: file.originalname,
                    size: file.size,
                },
                message: 'Leave document uploaded successfully',
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async uploadGeneralFile(file) {
        if (!file) {
            throw new common_1.BadRequestException('No file uploaded');
        }
        try {
            const fileUrl = await this.uploadService.uploadGeneralFile(file);
            return {
                success: true,
                data: {
                    url: fileUrl,
                    filename: file.originalname,
                    size: file.size,
                },
                message: 'File uploaded successfully',
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
};
exports.UploadController = UploadController;
__decorate([
    (0, common_1.Post)('profile-image'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', {
        limits: {
            fileSize: 5 * 1024 * 1024,
        },
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.startsWith('image/')) {
                return cb(new common_1.BadRequestException('Only image files are allowed'), false);
            }
            cb(null, true);
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadProfileImage", null);
__decorate([
    (0, common_1.Post)('leave-document'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('document', {
        limits: {
            fileSize: 10 * 1024 * 1024,
        },
        fileFilter: (req, file, cb) => {
            const allowedMimeTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'image/jpeg',
                'image/png',
            ];
            if (!allowedMimeTypes.includes(file.mimetype)) {
                return cb(new common_1.BadRequestException('Invalid file type. Only PDF, DOC, DOCX, JPG, and PNG files are allowed'), false);
            }
            cb(null, true);
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadLeaveDocument", null);
__decorate([
    (0, common_1.Post)('general-file'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        limits: {
            fileSize: 10 * 1024 * 1024,
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadGeneralFile", null);
exports.UploadController = UploadController = __decorate([
    (0, common_1.Controller)('api/upload'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [upload_service_1.UploadService])
], UploadController);
//# sourceMappingURL=upload.controller.js.map