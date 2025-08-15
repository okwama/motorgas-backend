import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sos } from '../entities/sos.entity';
import { CreateSosDto } from './dto/create-sos.dto';
import { UpdateSosDto } from './dto/update-sos.dto';

@Injectable()
export class SosService {
  constructor(
    @InjectRepository(Sos)
    private sosRepository: Repository<Sos>,
  ) {}

  async findAll(page: number = 1, limit: number = 10): Promise<[Sos[], number]> {
    const skip = (page - 1) * limit;
    
    const [sosAlerts, total] = await this.sosRepository.findAndCount({
      skip,
      take: limit,
      order: {
        created_at: 'DESC',
      },
    });

    return [sosAlerts, total];
  }

  async findActive(): Promise<[Sos[], number]> {
    const [sosAlerts, total] = await this.sosRepository.findAndCount({
      where: { status: 'active' },
      order: {
        created_at: 'DESC',
      },
    });

    return [sosAlerts, total];
  }

  async findByGuard(guardId: number): Promise<[Sos[], number]> {
    const [sosAlerts, total] = await this.sosRepository.findAndCount({
      where: { guard_id: guardId },
      order: {
        created_at: 'DESC',
      },
    });

    return [sosAlerts, total];
  }

  async findOne(id: number): Promise<Sos> {
    const sosAlert = await this.sosRepository.findOne({ where: { id } });
    
    if (!sosAlert) {
      throw new NotFoundException(`SOS alert with ID ${id} not found`);
    }
    
    return sosAlert;
  }

  async create(createSosDto: CreateSosDto): Promise<Sos> {
    const sosAlert = this.sosRepository.create(createSosDto);
    return this.sosRepository.save(sosAlert);
  }

  async update(id: number, updateSosDto: UpdateSosDto): Promise<Sos> {
    const sosAlert = await this.findOne(id);
    
    Object.assign(sosAlert, updateSosDto);
    return this.sosRepository.save(sosAlert);
  }

  async remove(id: number): Promise<void> {
    const sosAlert = await this.findOne(id);
    await this.sosRepository.remove(sosAlert);
  }
}
