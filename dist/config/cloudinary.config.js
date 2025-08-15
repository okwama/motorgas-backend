"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('cloudinary', () => ({
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'otienobryan',
    apiKey: process.env.CLOUDINARY_API_KEY || '825231187287193',
    apiSecret: process.env.CLOUDINARY_API_SECRET || 'BSFpWhpwt3RrNaxnZjWv7WFNwvY',
    uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET || 'motor_gas',
}));
//# sourceMappingURL=cloudinary.config.js.map