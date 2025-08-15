import { Controller, Post, Body, Get, UseGuards, Req, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Request } from 'express';

// Extend Request interface to include user property
interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    role: string;
    emplNo: string;
    name: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Req() request: Request) {
    return this.authService.login(loginDto, request);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('refresh')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto, @Req() request: Request) {
    return this.authService.refreshToken(refreshTokenDto, request);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() request: AuthenticatedRequest) {
    const user = request.user;
    if (!user) {
      throw new Error('User not authenticated');
    }
    const deviceId = request.headers['x-device-id'] as string;
    return this.authService.logout(user.userId, deviceId);
  }

  @Post('logout-all')
  @UseGuards(JwtAuthGuard)
  async logoutAll(@Req() request: AuthenticatedRequest) {
    const user = request.user;
    if (!user) {
      throw new Error('User not authenticated');
    }
    return this.authService.logout(user.userId);
  }

  @Get('sessions')
  @UseGuards(JwtAuthGuard)
  async getActiveSessions(@Req() request: AuthenticatedRequest) {
    const user = request.user;
    if (!user) {
      throw new Error('User not authenticated');
    }
    return this.authService.getActiveSessions(user.userId);
  }

  @Delete('sessions/:deviceId')
  @UseGuards(JwtAuthGuard)
  async logoutDevice(@Req() request: AuthenticatedRequest, @Param('deviceId') deviceId: string) {
    const user = request.user;
    if (!user) {
      throw new Error('User not authenticated');
    }
    return this.authService.logout(user.userId, deviceId);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(@Body() changePasswordDto: ChangePasswordDto, @Req() request: AuthenticatedRequest) {
    const user = request.user;
    if (!user) {
      throw new Error('User not authenticated');
    }
    changePasswordDto.userId = user.userId;
    return this.authService.changePassword(changePasswordDto);
  }

  @Get('validate')
  @UseGuards(JwtAuthGuard)
  async validateToken(@Req() request: AuthenticatedRequest) {
    const user = request.user;
    if (!user) {
      throw new Error('User not authenticated');
    }
    const deviceId = request.headers['x-device-id'] as string;
    const staff = await this.authService.validateToken(request.headers.authorization?.split(' ')[1] || '', deviceId);
    return {
      success: true,
      staff: {
        id: staff.id,
        name: staff.name,
        phone: staff.phone,
        role: staff.role,
        empl_no: staff.empl_no,
        station_id: staff.station_id,
        photo_url: staff.photo_url,
      },
    };
  }
} 