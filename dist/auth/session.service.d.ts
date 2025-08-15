import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Token } from '../entities/token.entity';
import { Staff } from '../entities/staff.entity';
export interface DeviceInfo {
    deviceId: string;
    userAgent: string;
    deviceType: 'mobile' | 'tablet' | 'desktop';
    appVersion: string;
    ipAddress: string;
    locationInfo?: string;
}
export interface TokenPair {
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
    refreshExpiresAt: Date;
}
export declare class SessionService {
    private tokenRepository;
    private staffRepository;
    private jwtService;
    private readonly MAX_DEVICES_PER_USER;
    private readonly ACCESS_TOKEN_EXPIRY;
    private readonly REFRESH_TOKEN_EXPIRY;
    constructor(tokenRepository: Repository<Token>, staffRepository: Repository<Staff>, jwtService: JwtService);
    createSession(staff: Staff, deviceInfo: DeviceInfo): Promise<TokenPair>;
    refreshSession(refreshToken: string, deviceId: string): Promise<TokenPair>;
    validateAccessToken(accessToken: string, deviceId: string): Promise<Staff>;
    logoutDevice(staffId: number, deviceId: string): Promise<void>;
    logoutAllDevices(staffId: number): Promise<void>;
    getActiveSessions(staffId: number): Promise<Token[]>;
    cleanupExpiredTokens(): Promise<number>;
    private enforceDeviceLimit;
    private isFirstDevice;
    private invalidateToken;
    private generateAccessToken;
    private generateRefreshToken;
}
