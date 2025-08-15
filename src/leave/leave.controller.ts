import { Controller, Post, Get, Body, UseGuards, Request, Query, Param, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { LeaveService } from './leave.service';
import { ApplyLeaveDto } from './dto/apply-leave.dto';
import { ApproveLeaveDto } from './dto/approve-leave.dto';

@ApiTags('Leave Management')
@Controller('leave')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Post('apply')
  @ApiOperation({ summary: 'Apply for leave' })
  @ApiResponse({ status: 201, description: 'Leave application submitted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request or overlapping leave' })
  @ApiResponse({ status: 404, description: 'Staff or leave type not found' })
  async applyLeave(@Request() req, @Body() applyLeaveDto: ApplyLeaveDto) {
    return this.leaveService.applyLeave(req.user.userId, applyLeaveDto);
  }

  @Put('approve/:id')
  @ApiOperation({ summary: 'Approve or reject leave application' })
  @ApiResponse({ status: 200, description: 'Leave application processed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request or already processed' })
  @ApiResponse({ status: 404, description: 'Leave application not found' })
  @ApiParam({ name: 'id', description: 'Leave application ID' })
  async approveLeave(
    @Request() req,
    @Param('id') leaveId: number,
    @Body() approveLeaveDto: ApproveLeaveDto,
  ) {
    return this.leaveService.approveLeave(req.user.userId, leaveId, approveLeaveDto);
  }

  @Get('applications')
  @ApiOperation({ summary: 'Get leave applications for current user' })
  @ApiResponse({ status: 200, description: 'Applications retrieved successfully' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getLeaveApplications(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.leaveService.getLeaveApplications(req.user.userId, page, limit);
  }

  @Get('applications/all')
  @ApiOperation({ summary: 'Get all leave applications (admin only)' })
  @ApiResponse({ status: 200, description: 'Applications retrieved successfully' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getAllLeaveApplications(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.leaveService.getAllLeaveApplications(page, limit);
  }

  @Get('balance')
  @ApiOperation({ summary: 'Get leave balance for current user' })
  @ApiResponse({ status: 200, description: 'Balance retrieved successfully' })
  async getLeaveBalance(@Request() req) {
    return this.leaveService.getLeaveBalance(req.user.userId);
  }

  @Get('types')
  @ApiOperation({ summary: 'Get available leave types' })
  @ApiResponse({ status: 200, description: 'Leave types retrieved successfully' })
  async getLeaveTypes() {
    return this.leaveService.getLeaveTypes();
  }
} 