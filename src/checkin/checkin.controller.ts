import { Controller, Post, Get, Body, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { CheckinService } from './checkin.service';
import { CheckinDto } from './dto/checkin.dto';
import { CheckoutDto } from './dto/checkout.dto';

@ApiTags('Check-in/Check-out')
@Controller('checkin')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class CheckinController {
  constructor(private readonly checkinService: CheckinService) {}

  @Post('checkin')
  @ApiOperation({ summary: 'Check in to a station' })
  @ApiResponse({ status: 201, description: 'Check-in successful' })
  @ApiResponse({ status: 400, description: 'Already checked in' })
  @ApiResponse({ status: 404, description: 'Staff or station not found' })
  async checkin(@Request() req, @Body() checkinDto: CheckinDto) {
    return this.checkinService.checkin(req.user.userId, checkinDto);
  }

  @Post('checkout')
  @ApiOperation({ summary: 'Check out from current station' })
  @ApiResponse({ status: 200, description: 'Check-out successful' })
  @ApiResponse({ status: 400, description: 'No active check-in found' })
  async checkout(@Request() req, @Body() checkoutDto: CheckoutDto) {
    return this.checkinService.checkout(req.user.userId, checkoutDto);
  }

  @Get('status')
  @ApiOperation({ summary: 'Get current check-in status' })
  @ApiResponse({ status: 200, description: 'Status retrieved successfully' })
  async getStatus(@Request() req) {
    return this.checkinService.getCheckinStatus(req.user.userId);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get check-in history for current user' })
  @ApiResponse({ status: 200, description: 'History retrieved successfully' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getHistory(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.checkinService.getCheckinHistory(req.user.userId, page, limit);
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all check-in records (admin only)' })
  @ApiResponse({ status: 200, description: 'Records retrieved successfully' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getAllCheckins(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.checkinService.getAllCheckins(page, limit);
  }
} 