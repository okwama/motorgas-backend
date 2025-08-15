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
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const cloudinary_1 = require("cloudinary");
const stream_1 = require("stream");
let UploadService = class UploadService {
    configService;
    constructor(configService) {
        this.configService = configService;
        cloudinary_1.v2.config({
            cloud_name: this.configService.get('cloudinary.cloudName'),
            api_key: this.configService.get('cloudinary.apiKey'),
            api_secret: this.configService.get('cloudinary.apiSecret'),
        });
    }
    async uploadProfileImage(file) {
        try {
            const result = await this.uploadToCloudinary(file, 'motor_gas/profiles');
            return result.secure_url;
        }
        catch (error) {
            throw new Error(`Failed to upload profile image: ${error.message}`);
        }
    }
    async uploadLeaveDocument(file) {
        try {
            const result = await this.uploadToCloudinary(file, 'motor_gas/leave_documents');
            return result.secure_url;
        }
        catch (error) {
            throw new Error(`Failed to upload leave document: ${error.message}`);
        }
    }
    async uploadGeneralFile(file, folder = 'motor_gas/general') {
        try {
            const result = await this.uploadToCloudinary(file, folder);
            return result.secure_url;
        }
        catch (error) {
            throw new Error(`Failed to upload file: ${error.message}`);
        }
    }
    async uploadToCloudinary(file, folder) {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                folder: folder,
                resource_type: 'auto',
                transformation: [
                    { width: 512, height: 512, crop: 'fill', quality: 'auto' }
                ]
            }, (error, result) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(result);
                }
            });
            const readableStream = new stream_1.Readable();
            readableStream.push(file.buffer);
            readableStream.push(null);
            readableStream.pipe(uploadStream);
        });
    }
    async deleteFile(publicId) {
        try {
            const result = await cloudinary_1.v2.uploader.destroy(publicId);
            return result.result === 'ok';
        }
        catch (error) {
            console.error('Failed to delete file:', error);
            return false;
        }
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], UploadService);
//# sourceMappingURL=upload.service.js.map