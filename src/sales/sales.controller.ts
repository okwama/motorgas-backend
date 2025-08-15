import { Controller, Post, Get, Body, Param, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { CreateWalkInClientDto } from './dto/create-walkin-client.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('sales')
@UseGuards(JwtAuthGuard)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  async createSale(@Body() createSaleDto: CreateSaleDto, @Request() req) {
    const staffId = req.user?.userId || req.user?.id;
    console.log('🔍 Creating sale for staff ID:', staffId);
    
    if (!staffId || isNaN(staffId) || staffId <= 0) {
      throw new UnauthorizedException('Invalid or missing staff ID in token');
    }
    
    return this.salesService.createSale(createSaleDto, Number(staffId));
  }

  @Post('walkin-client')
  async createWalkInClient(@Body() createWalkInClientDto: CreateWalkInClientDto) {
    return this.salesService.createWalkInClient(createWalkInClientDto);
  }

  @Get('station/:stationId')
  async getSalesByStation(@Param('stationId') stationId: string) {
    return this.salesService.getSalesByStation(+stationId);
  }

  @Get('client/:clientId')
  async getSalesByClient(@Param('clientId') clientId: string) {
    return this.salesService.getSalesByClient(+clientId);
  }

  @Get('my-sales')
  async getMySales(@Request() req: any) {
    const staffId = req.user?.userId || req.user?.id;
    console.log('🔍 JWT user data:', req.user);
    console.log('🔍 Staff ID from token:', staffId, 'Type:', typeof staffId);
    
    if (!staffId || isNaN(staffId) || staffId <= 0) {
      throw new UnauthorizedException('Invalid or missing staff ID in token');
    }
    
    return this.salesService.getSalesByStaff(Number(staffId));
  }

  @Get('staff/:staffId')
  async getSalesByStaff(@Param('staffId') staffId: string) {
    return this.salesService.getSalesByStaff(+staffId);
  }

  @Get('pumps/station/:stationId')
  async getPumpsByStation(@Param('stationId') stationId: string) {
    return this.salesService.getPumpsByStation(+stationId);
  }

  @Get('clients/key-accounts')
  async getKeyAccountClients() {
    return this.salesService.getKeyAccountClients();
  }

  @Get('clients/walk-in')
  async getWalkInClients() {
    return this.salesService.getWalkInClients();
  }

  @Get('station/:stationId/price')
  async getStationCurrentPrice(@Param('stationId') stationId: string) {
    const price = await this.salesService.getStationCurrentPrice(+stationId);
    return { current_price: price };
  }

  @Get(':id')
  async getSaleById(@Param('id') id: string) {
    return this.salesService.getSaleById(+id);
  }
}
