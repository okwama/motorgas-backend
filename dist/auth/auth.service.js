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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcryptjs");
const staff_entity_1 = require("../entities/staff.entity");
const token_entity_1 = require("../entities/token.entity");
const session_service_1 = require("./session.service");
let AuthService = class AuthService {
    staffRepository;
    tokenRepository;
    jwtService;
    sessionService;
    constructor(staffRepository, tokenRepository, jwtService, sessionService) {
        this.staffRepository = staffRepository;
        this.tokenRepository = tokenRepository;
        this.jwtService = jwtService;
        this.sessionService = sessionService;
    }
    async login(loginDto, request) {
        const { phone, password, deviceInfo } = loginDto;
        let formattedPhone = phone;
        if (phone.startsWith('0')) {
            formattedPhone = `+254${phone.substring(1)}`;
        }
        else if (!phone.startsWith('+254')) {
            formattedPhone = `+254${phone}`;
        }
        let staff = await this.staffRepository.findOne({
            where: { phone: formattedPhone },
            relations: ['station'],
        });
        if (!staff) {
            staff = await this.staffRepository.findOne({
                where: { phone },
                relations: ['station'],
            });
        }
        if (!staff) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!staff.password) {
            throw new common_1.UnauthorizedException('Account not properly configured');
        }
        const isPasswordValid = await bcrypt.compare(password, staff.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (staff.status !== 1) {
            throw new common_1.UnauthorizedException('Account is inactive');
        }
        const deviceData = {
            deviceId: deviceInfo?.deviceId || this.generateDeviceId(request),
            userAgent: request.headers['user-agent'] || 'Unknown',
            deviceType: this.detectDeviceType(request.headers['user-agent'] || ''),
            appVersion: deviceInfo?.appVersion || '1.0.0',
            ipAddress: this.getClientIp(request),
            locationInfo: deviceInfo?.locationInfo,
        };
        const tokenPair = await this.sessionService.createSession(staff, deviceData);
        return {
            success: true,
            token: tokenPair.accessToken,
            refreshToken: tokenPair.refreshToken,
            expiresAt: tokenPair.expiresAt,
            refreshExpiresAt: tokenPair.refreshExpiresAt,
            staff: {
                id: staff.id,
                name: staff.name,
                phone: staff.phone,
                role: staff.role,
                empl_no: staff.empl_no,
                station_id: staff.station_id,
                station: staff.station,
                photo_url: staff.photo_url,
            },
            deviceInfo: deviceData,
        };
    }
    async refreshToken(refreshTokenDto, request) {
        const { refreshToken, deviceId } = refreshTokenDto;
        const tokenPair = await this.sessionService.refreshSession(refreshToken, deviceId);
        const staff = await this.staffRepository.findOne({
            where: { id: tokenPair.accessToken ? this.jwtService.verify(tokenPair.accessToken).userId : null },
            relations: ['station'],
        });
        if (!staff) {
            throw new common_1.UnauthorizedException('Staff not found');
        }
        return {
            success: true,
            token: tokenPair.accessToken,
            refreshToken: tokenPair.refreshToken,
            expiresAt: tokenPair.expiresAt,
            refreshExpiresAt: tokenPair.refreshExpiresAt,
            staff: {
                id: staff.id,
                name: staff.name,
                phone: staff.phone,
                role: staff.role,
                empl_no: staff.empl_no,
                station_id: staff.station_id,
                station: staff.station,
                photo_url: staff.photo_url,
            },
        };
    }
    async logout(userId, deviceId) {
        if (deviceId) {
            await this.sessionService.logoutDevice(userId, deviceId);
        }
        else {
            await this.sessionService.logoutAllDevices(userId);
        }
        return { success: true, message: 'Logged out successfully' };
    }
    async validateUser(userId) {
        const staff = await this.staffRepository.findOne({
            where: { id: userId },
            relations: ['station'],
        });
        if (!staff || staff.status !== 1) {
            throw new common_1.UnauthorizedException('User not found or inactive');
        }
        return staff;
    }
    async validateToken(accessToken, deviceId) {
        return this.sessionService.validateAccessToken(accessToken, deviceId);
    }
    async getActiveSessions(userId) {
        const sessions = await this.sessionService.getActiveSessions(userId);
        return sessions.map(session => ({
            id: session.id,
            deviceId: session.device_id,
            deviceType: session.device_type,
            userAgent: session.user_agent,
            appVersion: session.app_version,
            ipAddress: session.ip_address,
            lastUsed: session.last_used_at,
            isPrimary: session.is_primary,
            createdAt: session.created_at,
        }));
    }
    async register(registerDto) {
        const { name, phone, empl_no, role, password, station_id = 0, status = 1 } = registerDto;
        let formattedPhone = phone;
        if (phone.startsWith('0')) {
            formattedPhone = `+254${phone.substring(1)}`;
        }
        else if (!phone.startsWith('+254')) {
            formattedPhone = `+254${phone}`;
        }
        let existingPhone = await this.staffRepository.findOne({
            where: { phone: formattedPhone },
        });
        if (!existingPhone) {
            existingPhone = await this.staffRepository.findOne({
                where: { phone },
            });
        }
        if (existingPhone) {
            throw new common_1.BadRequestException('Phone number already exists');
        }
        const existingEmployee = await this.staffRepository.findOne({
            where: { empl_no },
        });
        if (existingEmployee) {
            throw new common_1.BadRequestException('Employee number already exists');
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newStaff = this.staffRepository.create({
            name,
            phone: formattedPhone,
            password: hashedPassword,
            role_id: 0,
            role,
            station_id,
            empl_no,
            status,
            created_at: new Date(),
        });
        const savedStaff = await this.staffRepository.save(newStaff);
        return {
            success: true,
            message: 'Staff member registered successfully',
            data: {
                id: savedStaff.id,
                name: savedStaff.name,
                phone: savedStaff.phone,
                role: savedStaff.role,
                empl_no: savedStaff.empl_no,
                station_id: savedStaff.station_id,
                status: savedStaff.status,
            },
        };
    }
    async changePassword(changePasswordDto) {
        const { phoneNumber, userId, currentPassword, newPassword } = changePasswordDto;
        const staff = await this.staffRepository.findOne({
            where: { phone: phoneNumber, id: userId },
        });
        if (!staff) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, staff.password);
        if (!isCurrentPasswordValid) {
            throw new common_1.BadRequestException('Current password is incorrect');
        }
        const saltRounds = 10;
        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
        await this.staffRepository.update({ id: userId }, { password: hashedNewPassword });
        await this.sessionService.logoutAllDevices(userId);
        return {
            success: true,
            message: 'Password changed successfully. Please login again.',
        };
    }
    generateDeviceId(request) {
        const userAgent = request.headers['user-agent'] || '';
        const ip = this.getClientIp(request);
        const timestamp = Date.now().toString();
        return Buffer.from(`${userAgent}-${ip}-${timestamp}`).toString('base64').substring(0, 32);
    }
    detectDeviceType(userAgent) {
        const ua = userAgent.toLowerCase();
        if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
            return 'mobile';
        }
        else if (ua.includes('tablet') || ua.includes('ipad')) {
            return 'tablet';
        }
        else {
            return 'desktop';
        }
    }
    getClientIp(request) {
        return request.headers['x-forwarded-for']?.split(',')[0] ||
            request.headers['x-real-ip'] ||
            request.connection.remoteAddress ||
            request.socket.remoteAddress ||
            'unknown';
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(staff_entity_1.Staff)),
    __param(1, (0, typeorm_1.InjectRepository)(token_entity_1.Token)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService,
        session_service_1.SessionService])
], AuthService);
//# sourceMappingURL=auth.service.js.map