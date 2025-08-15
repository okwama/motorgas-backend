import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Request } from 'express';

import { Staff } from '../entities/staff.entity';
import { Token } from '../entities/token.entity';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { SessionService, DeviceInfo } from './session.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
    private jwtService: JwtService,
    private sessionService: SessionService,
  ) {}

  async login(loginDto: LoginDto, request: Request) {
    const { phone, password, deviceInfo } = loginDto;

    // Format phone number to international format
    let formattedPhone = phone;
    if (phone.startsWith('0')) {
      formattedPhone = `+254${phone.substring(1)}`;
    } else if (!phone.startsWith('+254')) {
      formattedPhone = `+254${phone}`;
    }

    // Find staff by phone number (try both formats)
    let staff = await this.staffRepository.findOne({
      where: { phone: formattedPhone },
      relations: ['station'],
    });

    // If not found with formatted phone, try original phone
    if (!staff) {
      staff = await this.staffRepository.findOne({
        where: { phone },
        relations: ['station'],
      });
    }

    if (!staff) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if password is set
    if (!staff.password) {
      throw new UnauthorizedException('Account not properly configured');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, staff.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if staff is active
    if (staff.status !== 1) {
      throw new UnauthorizedException('Account is inactive');
    }

    // Extract device information
    const deviceData: DeviceInfo = {
      deviceId: deviceInfo?.deviceId || this.generateDeviceId(request),
      userAgent: request.headers['user-agent'] || 'Unknown',
      deviceType: this.detectDeviceType(request.headers['user-agent'] || ''),
      appVersion: deviceInfo?.appVersion || '1.0.0',
      ipAddress: this.getClientIp(request),
      locationInfo: deviceInfo?.locationInfo,
    };

    // Create session using session service
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

  async refreshToken(refreshTokenDto: RefreshTokenDto, request: Request) {
    const { refreshToken, deviceId } = refreshTokenDto;

    // Use session service to refresh token
    const tokenPair = await this.sessionService.refreshSession(refreshToken, deviceId);

    // Get updated staff data
    const staff = await this.staffRepository.findOne({
      where: { id: tokenPair.accessToken ? this.jwtService.verify(tokenPair.accessToken).userId : null },
      relations: ['station'],
    });

    if (!staff) {
      throw new UnauthorizedException('Staff not found');
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

  async logout(userId: number, deviceId?: string) {
    if (deviceId) {
      // Logout from specific device
      await this.sessionService.logoutDevice(userId, deviceId);
    } else {
      // Logout from all devices
      await this.sessionService.logoutAllDevices(userId);
    }

    return { success: true, message: 'Logged out successfully' };
  }

  async validateUser(userId: number): Promise<Staff> {
    const staff = await this.staffRepository.findOne({
      where: { id: userId },
      relations: ['station'],
    });

    if (!staff || staff.status !== 1) {
      throw new UnauthorizedException('User not found or inactive');
    }

    return staff;
  }

  async validateToken(accessToken: string, deviceId: string): Promise<Staff> {
    return this.sessionService.validateAccessToken(accessToken, deviceId);
  }

  async getActiveSessions(userId: number) {
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

  async register(registerDto: RegisterDto) {
    const { name, phone, empl_no, role, password, station_id = 0, status = 1 } = registerDto;

    // Format phone number to international format
    let formattedPhone = phone;
    if (phone.startsWith('0')) {
      formattedPhone = `+254${phone.substring(1)}`;
    } else if (!phone.startsWith('+254')) {
      formattedPhone = `+254${phone}`;
    }

    // Check if phone number already exists (try both formats)
    let existingPhone = await this.staffRepository.findOne({
      where: { phone: formattedPhone },
    });

    if (!existingPhone) {
      existingPhone = await this.staffRepository.findOne({
        where: { phone },
      });
    }

    if (existingPhone) {
      throw new BadRequestException('Phone number already exists');
    }

    // Check if employee number already exists
    const existingEmployee = await this.staffRepository.findOne({
      where: { empl_no },
    });

    if (existingEmployee) {
      throw new BadRequestException('Employee number already exists');
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new staff member
    const newStaff = this.staffRepository.create({
      name,
      phone: formattedPhone, // Use formatted phone number
      password: hashedPassword,
      role_id: 0, // Default role ID
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

  async changePassword(changePasswordDto: ChangePasswordDto) {
    const { phoneNumber, userId, currentPassword, newPassword } = changePasswordDto;

    // Find staff by phone number and user ID
    const staff = await this.staffRepository.findOne({
      where: { phone: phoneNumber, id: userId },
    });

    if (!staff) {
      throw new UnauthorizedException('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, staff.password);
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Hash new password
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await this.staffRepository.update(
      { id: userId },
      { password: hashedNewPassword }
    );

    // Invalidate all sessions for security
    await this.sessionService.logoutAllDevices(userId);

    return {
      success: true,
      message: 'Password changed successfully. Please login again.',
    };
  }

  // Utility methods
  private generateDeviceId(request: Request): string {
    const userAgent = request.headers['user-agent'] || '';
    const ip = this.getClientIp(request);
    const timestamp = Date.now().toString();
    
    // Create a simple hash for device identification
    return Buffer.from(`${userAgent}-${ip}-${timestamp}`).toString('base64').substring(0, 32);
  }

  private detectDeviceType(userAgent: string): 'mobile' | 'tablet' | 'desktop' {
    const ua = userAgent.toLowerCase();
    
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
      return 'mobile';
    } else if (ua.includes('tablet') || ua.includes('ipad')) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  }

  private getClientIp(request: Request): string {
    return (request.headers['x-forwarded-for'] as string)?.split(',')[0] ||
           (request.headers['x-real-ip'] as string) ||
           request.connection.remoteAddress ||
           request.socket.remoteAddress ||
           'unknown';
  }
} 