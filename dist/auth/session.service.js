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
exports.SessionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const token_entity_1 = require("../entities/token.entity");
const staff_entity_1 = require("../entities/staff.entity");
let SessionService = class SessionService {
    tokenRepository;
    staffRepository;
    jwtService;
    MAX_DEVICES_PER_USER = 3;
    ACCESS_TOKEN_EXPIRY = '5h';
    REFRESH_TOKEN_EXPIRY = '30d';
    constructor(tokenRepository, staffRepository, jwtService) {
        this.tokenRepository = tokenRepository;
        this.staffRepository = staffRepository;
        this.jwtService = jwtService;
    }
    async createSession(staff, deviceInfo) {
        await this.enforceDeviceLimit(staff.id);
        const accessToken = this.generateAccessToken(staff);
        const refreshToken = this.generateRefreshToken(staff.id);
        const expiresAt = new Date(Date.now() + 5 * 60 * 60 * 1000);
        const refreshExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        const token = this.tokenRepository.create({
            staff_id: staff.id,
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_at: expiresAt,
            refresh_expires_at: refreshExpiresAt,
            device_id: deviceInfo.deviceId,
            user_agent: deviceInfo.userAgent,
            device_type: deviceInfo.deviceType,
            app_version: deviceInfo.appVersion,
            ip_address: deviceInfo.ipAddress,
            location_info: deviceInfo.locationInfo,
            is_primary: await this.isFirstDevice(staff.id) ? 1 : 0,
            refresh_count: 0,
            is_valid: 1,
        });
        await this.tokenRepository.save(token);
        return {
            accessToken,
            refreshToken,
            expiresAt,
            refreshExpiresAt,
        };
    }
    async refreshSession(refreshToken, deviceId) {
        try {
            const payload = this.jwtService.verify(refreshToken);
            const tokenRecord = await this.tokenRepository.findOne({
                where: {
                    refresh_token: refreshToken,
                    device_id: deviceId,
                    is_valid: 1,
                },
                relations: ['staff'],
            });
            if (!tokenRecord || !tokenRecord.staff) {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            if (tokenRecord.refresh_expires_at < new Date()) {
                await this.invalidateToken(tokenRecord.id);
                throw new common_1.UnauthorizedException('Refresh token expired');
            }
            if (tokenRecord.refresh_count > 100) {
                await this.invalidateToken(tokenRecord.id);
                throw new common_1.UnauthorizedException('Refresh limit exceeded');
            }
            const newAccessToken = this.generateAccessToken(tokenRecord.staff);
            const newRefreshToken = this.generateRefreshToken(tokenRecord.staff.id);
            tokenRecord.access_token = newAccessToken;
            tokenRecord.refresh_token = newRefreshToken;
            tokenRecord.expires_at = new Date(Date.now() + 5 * 60 * 60 * 1000);
            tokenRecord.refresh_count += 1;
            tokenRecord.last_used_at = new Date();
            await this.tokenRepository.save(tokenRecord);
            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
                expiresAt: tokenRecord.expires_at,
                refreshExpiresAt: tokenRecord.refresh_expires_at,
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async validateAccessToken(accessToken, deviceId) {
        try {
            const payload = this.jwtService.verify(accessToken);
            const tokenRecord = await this.tokenRepository.findOne({
                where: {
                    access_token: accessToken,
                    device_id: deviceId,
                    is_valid: 1,
                },
                relations: ['staff'],
            });
            if (!tokenRecord || !tokenRecord.staff) {
                throw new common_1.UnauthorizedException('Invalid access token');
            }
            if (tokenRecord.expires_at < new Date()) {
                throw new common_1.UnauthorizedException('Access token expired');
            }
            tokenRecord.last_used_at = new Date();
            await this.tokenRepository.save(tokenRecord);
            return tokenRecord.staff;
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid access token');
        }
    }
    async logoutDevice(staffId, deviceId) {
        await this.tokenRepository.update({ staff_id: staffId, device_id: deviceId, is_valid: 1 }, { is_valid: 0 });
    }
    async logoutAllDevices(staffId) {
        await this.tokenRepository.update({ staff_id: staffId, is_valid: 1 }, { is_valid: 0 });
    }
    async getActiveSessions(staffId) {
        return this.tokenRepository.find({
            where: { staff_id: staffId, is_valid: 1 },
            order: { last_used_at: 'DESC' },
        });
    }
    async cleanupExpiredTokens() {
        const result = await this.tokenRepository.update({
            expires_at: (0, typeorm_2.LessThan)(new Date()),
            is_valid: 1,
        }, { is_valid: 0 });
        return result.affected || 0;
    }
    async enforceDeviceLimit(staffId) {
        const activeSessions = await this.tokenRepository.count({
            where: { staff_id: staffId, is_valid: 1 },
        });
        if (activeSessions >= this.MAX_DEVICES_PER_USER) {
            const oldestSession = await this.tokenRepository.findOne({
                where: { staff_id: staffId, is_valid: 1 },
                order: { created_at: 'ASC' },
            });
            if (oldestSession) {
                await this.invalidateToken(oldestSession.id);
            }
        }
    }
    async isFirstDevice(staffId) {
        const activeSessions = await this.tokenRepository.count({
            where: { staff_id: staffId, is_valid: 1 },
        });
        return activeSessions === 0;
    }
    async invalidateToken(tokenId) {
        await this.tokenRepository.update({ id: tokenId }, { is_valid: 0 });
    }
    generateAccessToken(staff) {
        const payload = {
            userId: staff.id,
            role: staff.role,
            emplNo: staff.empl_no,
            name: staff.name,
            type: 'access',
        };
        return this.jwtService.sign(payload, { expiresIn: this.ACCESS_TOKEN_EXPIRY });
    }
    generateRefreshToken(staffId) {
        const payload = {
            userId: staffId,
            type: 'refresh',
        };
        return this.jwtService.sign(payload, { expiresIn: this.REFRESH_TOKEN_EXPIRY });
    }
};
exports.SessionService = SessionService;
exports.SessionService = SessionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(token_entity_1.Token)),
    __param(1, (0, typeorm_1.InjectRepository)(staff_entity_1.Staff)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService])
], SessionService);
//# sourceMappingURL=session.service.js.map