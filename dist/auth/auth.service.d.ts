import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { Staff } from '../entities/staff.entity';
import { Token } from '../entities/token.entity';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { SessionService, DeviceInfo } from './session.service';
export declare class AuthService {
    private staffRepository;
    private tokenRepository;
    private jwtService;
    private sessionService;
    constructor(staffRepository: Repository<Staff>, tokenRepository: Repository<Token>, jwtService: JwtService, sessionService: SessionService);
    login(loginDto: LoginDto, request: Request): Promise<{
        success: boolean;
        token: string;
        refreshToken: string;
        expiresAt: Date;
        refreshExpiresAt: Date;
        staff: {
            id: number;
            name: string;
            phone: string;
            role: string;
            empl_no: string;
            station_id: number;
            station: import("../entities/station.entity").Station;
            photo_url: string;
        };
        deviceInfo: DeviceInfo;
    }>;
    refreshToken(refreshTokenDto: RefreshTokenDto, request: Request): Promise<{
        success: boolean;
        token: string;
        refreshToken: string;
        expiresAt: Date;
        refreshExpiresAt: Date;
        staff: {
            id: number;
            name: string;
            phone: string;
            role: string;
            empl_no: string;
            station_id: number;
            station: import("../entities/station.entity").Station;
            photo_url: string;
        };
    }>;
    logout(userId: number, deviceId?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    validateUser(userId: number): Promise<Staff>;
    validateToken(accessToken: string, deviceId: string): Promise<Staff>;
    getActiveSessions(userId: number): Promise<{
        id: number;
        deviceId: string;
        deviceType: string;
        userAgent: string;
        appVersion: string;
        ipAddress: string;
        lastUsed: Date;
        isPrimary: number;
        createdAt: Date;
    }[]>;
    register(registerDto: RegisterDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            name: string;
            phone: string;
            role: string;
            empl_no: string;
            station_id: number;
            status: number;
        };
    }>;
    changePassword(changePasswordDto: ChangePasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
    private generateDeviceId;
    private detectDeviceType;
    private getClientIp;
}
