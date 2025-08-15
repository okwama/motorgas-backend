import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Request } from 'express';
interface AuthenticatedRequest extends Request {
    user?: {
        userId: number;
        role: string;
        emplNo: string;
        name: string;
    };
}
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
        deviceInfo: import("./session.service").DeviceInfo;
    }>;
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
    logout(request: AuthenticatedRequest): Promise<{
        success: boolean;
        message: string;
    }>;
    logoutAll(request: AuthenticatedRequest): Promise<{
        success: boolean;
        message: string;
    }>;
    getActiveSessions(request: AuthenticatedRequest): Promise<{
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
    logoutDevice(request: AuthenticatedRequest, deviceId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    changePassword(changePasswordDto: ChangePasswordDto, request: AuthenticatedRequest): Promise<{
        success: boolean;
        message: string;
    }>;
    validateToken(request: AuthenticatedRequest): Promise<{
        success: boolean;
        staff: {
            id: number;
            name: string;
            phone: string;
            role: string;
            empl_no: string;
            station_id: number;
            photo_url: string;
        };
    }>;
}
export {};
