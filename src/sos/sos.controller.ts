import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { SosService } from './sos.service';
import { CreateSosDto } from './dto/create-sos.dto';
import { UpdateSosDto } from './dto/update-sos.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('sos')
@UseGuards(JwtAuthGuard)
export class SosController {
  constructor(private readonly sosService: SosService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const [sosAlerts, total] = await this.sosService.findAll(page, limit);
    const totalPages = Math.ceil(total / limit);

    return {
      data: sosAlerts,
      total,
      page,
      limit,
      total_pages: totalPages,
    };
  }

  @Get('active')
  async findActive() {
    const [sosAlerts, total] = await this.sosService.findActive();
    return {
      data: sosAlerts,
      total,
    };
  }

  @Get('guard/:guardId')
  async findByGuard(@Param('guardId') guardId: string) {
    const [sosAlerts, total] = await this.sosService.findByGuard(+guardId);
    return {
      data: sosAlerts,
      total,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.sosService.findOne(+id);
  }

  @Post()
  async create(@Body() createSosDto: CreateSosDto) {
    return this.sosService.create(createSosDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSosDto: UpdateSosDto,
  ) {
    return this.sosService.update(+id, updateSosDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.sosService.remove(+id);
  }
}
