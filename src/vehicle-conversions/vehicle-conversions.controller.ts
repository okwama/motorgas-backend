import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { VehicleConversionsService } from './vehicle-conversions.service';
import { CreateVehicleConversionDto } from './dto/create-vehicle-conversion.dto';
import { UpdateVehicleConversionDto } from './dto/update-vehicle-conversion.dto';
import { QueryVehicleConversionDto } from './dto/query-vehicle-conversion.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: {
    userId: number;
  };
}

@Controller('vehicle-conversions')
@UseGuards(JwtAuthGuard)
export class VehicleConversionsController {
  constructor(private readonly vehicleConversionsService: VehicleConversionsService) {}

  @Post()
  async create(
    @Body() createVehicleConversionDto: CreateVehicleConversionDto,
    @Req() request: AuthenticatedRequest,
  ) {
    try {
      console.log('Received DTO:', JSON.stringify(createVehicleConversionDto, null, 2));
      const conversion = await this.vehicleConversionsService.create(createVehicleConversionDto);

      return {
        success: true,
        message: 'Vehicle conversion recorded successfully',
        data: conversion,
      };
    } catch (error) {
      console.error('Error creating vehicle conversion:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get()
  async findAll(@Query() queryDto: QueryVehicleConversionDto) {
    try {
      const [conversions, total] = await this.vehicleConversionsService.findAll(queryDto);

      return {
        success: true,
        message: 'Vehicle conversions retrieved successfully',
        data: conversions,
        total,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get('stats')
  async getStats(@Query() queryDto: QueryVehicleConversionDto) {
    try {
      const stats = await this.vehicleConversionsService.getStats(queryDto);

      return {
        success: true,
        message: 'Vehicle conversion statistics retrieved successfully',
        data: stats,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const conversion = await this.vehicleConversionsService.findOne(+id);

      return {
        success: true,
        message: 'Vehicle conversion retrieved successfully',
        data: conversion,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateVehicleConversionDto: UpdateVehicleConversionDto,
  ) {
    try {
      const conversion = await this.vehicleConversionsService.update(+id, updateVehicleConversionDto);

      return {
        success: true,
        message: 'Vehicle conversion updated successfully',
        data: conversion,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.vehicleConversionsService.remove(+id);

      return {
        success: true,
        message: 'Vehicle conversion deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
