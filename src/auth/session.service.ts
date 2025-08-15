import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
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

@Injectable()
export class SessionService {
  private readonly MAX_DEVICES_PER_USER = 3;
  private readonly ACCESS_TOKEN_EXPIRY = '5h';
  private readonly REFRESH_TOKEN_EXPIRY = '30d';

  constructor(
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
    private jwtService: JwtService,
  ) {}

  /**
   * Create new session with enhanced security
   */
  async createSession(staff: Staff, deviceInfo: DeviceInfo): Promise<TokenPair> {
    // Check device limit
    await this.enforceDeviceLimit(staff.id);

    // Generate tokens
    const accessToken = this.generateAccessToken(staff);
    const refreshToken = this.generateRefreshToken(staff.id);

    // Calculate expiry times
    const expiresAt = new Date(Date.now() + 5 * 60 * 60 * 1000); // 5 hours
    const refreshExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    // Create token record
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

  /**
   * Refresh access token using refresh token
   */
  async refreshSession(refreshToken: string, deviceId: string): Promise<TokenPair> {
    try {
      // Verify refresh token
      const payload = this.jwtService.verify(refreshToken);
      
      // Find token record
      const tokenRecord = await this.tokenRepository.findOne({
        where: {
          refresh_token: refreshToken,
          device_id: deviceId,
          is_valid: 1,
        },
        relations: ['staff'],
      });

      if (!tokenRecord || !tokenRecord.staff) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Check if refresh token is expired
      if (tokenRecord.refresh_expires_at < new Date()) {
        await this.invalidateToken(tokenRecord.id);
        throw new UnauthorizedException('Refresh token expired');
      }

      // Check refresh count limit (prevent abuse)
      if (tokenRecord.refresh_count > 100) {
        await this.invalidateToken(tokenRecord.id);
        throw new UnauthorizedException('Refresh limit exceeded');
      }

      // Generate new tokens
      const newAccessToken = this.generateAccessToken(tokenRecord.staff);
      const newRefreshToken = this.generateRefreshToken(tokenRecord.staff.id);

      // Update token record
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
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Validate access token and update last used
   */
  async validateAccessToken(accessToken: string, deviceId: string): Promise<Staff> {
    try {
      // Verify JWT
      const payload = this.jwtService.verify(accessToken);
      
      // Find token record
      const tokenRecord = await this.tokenRepository.findOne({
        where: {
          access_token: accessToken,
          device_id: deviceId,
          is_valid: 1,
        },
        relations: ['staff'],
      });

      if (!tokenRecord || !tokenRecord.staff) {
        throw new UnauthorizedException('Invalid access token');
      }

      // Check if token is expired
      if (tokenRecord.expires_at < new Date()) {
        throw new UnauthorizedException('Access token expired');
      }

      // Update last used
      tokenRecord.last_used_at = new Date();
      await this.tokenRepository.save(tokenRecord);

      return tokenRecord.staff;
    } catch (error) {
      throw new UnauthorizedException('Invalid access token');
    }
  }

  /**
   * Logout from specific device
   */
  async logoutDevice(staffId: number, deviceId: string): Promise<void> {
    await this.tokenRepository.update(
      { staff_id: staffId, device_id: deviceId, is_valid: 1 },
      { is_valid: 0 }
    );
  }

  /**
   * Logout from all devices
   */
  async logoutAllDevices(staffId: number): Promise<void> {
    await this.tokenRepository.update(
      { staff_id: staffId, is_valid: 1 },
      { is_valid: 0 }
    );
  }

  /**
   * Get active sessions for user
   */
  async getActiveSessions(staffId: number): Promise<Token[]> {
    return this.tokenRepository.find({
      where: { staff_id: staffId, is_valid: 1 },
      order: { last_used_at: 'DESC' },
    });
  }

  /**
   * Clean up expired tokens
   */
  async cleanupExpiredTokens(): Promise<number> {
    const result = await this.tokenRepository.update(
      {
        expires_at: LessThan(new Date()),
        is_valid: 1,
      },
      { is_valid: 0 }
    );
    return result.affected || 0;
  }

  /**
   * Enforce device limit per user
   */
  private async enforceDeviceLimit(staffId: number): Promise<void> {
    const activeSessions = await this.tokenRepository.count({
      where: { staff_id: staffId, is_valid: 1 },
    });

    if (activeSessions >= this.MAX_DEVICES_PER_USER) {
      // Remove oldest session
      const oldestSession = await this.tokenRepository.findOne({
        where: { staff_id: staffId, is_valid: 1 },
        order: { created_at: 'ASC' },
      });

      if (oldestSession) {
        await this.invalidateToken(oldestSession.id);
      }
    }
  }

  /**
   * Check if this is the first device for the user
   */
  private async isFirstDevice(staffId: number): Promise<boolean> {
    const activeSessions = await this.tokenRepository.count({
      where: { staff_id: staffId, is_valid: 1 },
    });
    return activeSessions === 0;
  }

  /**
   * Invalidate specific token
   */
  private async invalidateToken(tokenId: number): Promise<void> {
    await this.tokenRepository.update(
      { id: tokenId },
      { is_valid: 0 }
    );
  }

  /**
   * Generate access token
   */
  private generateAccessToken(staff: Staff): string {
    const payload = {
      userId: staff.id,
      role: staff.role,
      emplNo: staff.empl_no,
      name: staff.name,
      type: 'access',
    };
    return this.jwtService.sign(payload, { expiresIn: this.ACCESS_TOKEN_EXPIRY });
  }

  /**
   * Generate refresh token
   */
  private generateRefreshToken(staffId: number): string {
    const payload = {
      userId: staffId,
      type: 'refresh',
    };
    return this.jwtService.sign(payload, { expiresIn: this.REFRESH_TOKEN_EXPIRY });
  }
}
