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
import { StationsService } from './stations.service';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('stations')
@UseGuards(JwtAuthGuard)
export class StationsController {
  constructor(private readonly stationsService: StationsService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const [stations, total] = await this.stationsService.findAll(page, limit);
    const totalPages = Math.ceil(total / limit);

    return {
      data: stations,
      total,
      page,
      limit,
      total_pages: totalPages,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.stationsService.findOne(+id);
  }

  @Post()
  async create(@Body() createStationDto: CreateStationDto) {
    return this.stationsService.create(createStationDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateStationDto: UpdateStationDto,
  ) {
    return this.stationsService.update(+id, updateStationDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.stationsService.remove(+id);
  }
}
