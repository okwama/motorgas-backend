import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Station } from '../entities/station.entity';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';

@Injectable()
export class StationsService {
  constructor(
    @InjectRepository(Station)
    private stationRepository: Repository<Station>,
  ) {}

  async findAll(page: number = 1, limit: number = 10): Promise<[Station[], number]> {
    const skip = (page - 1) * limit;
    
    const [stations, total] = await this.stationRepository.findAndCount({
      skip,
      take: limit,
      order: {
        created_at: 'DESC',
      },
    });

    return [stations, total];
  }

  async findOne(id: number): Promise<Station> {
    const station = await this.stationRepository.findOne({ where: { id } });
    
    if (!station) {
      throw new NotFoundException(`Station with ID ${id} not found`);
    }
    
    return station;
  }

  async create(createStationDto: CreateStationDto): Promise<Station> {
    const station = this.stationRepository.create(createStationDto);
    return this.stationRepository.save(station);
  }

  async update(id: number, updateStationDto: UpdateStationDto): Promise<Station> {
    const station = await this.findOne(id);
    
    Object.assign(station, updateStationDto);
    return this.stationRepository.save(station);
  }

  async remove(id: number): Promise<void> {
    const station = await this.findOne(id);
    await this.stationRepository.remove(station);
  }
}
