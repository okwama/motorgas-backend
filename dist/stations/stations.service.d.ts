import { Repository } from 'typeorm';
import { Station } from '../entities/station.entity';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
export declare class StationsService {
    private stationRepository;
    constructor(stationRepository: Repository<Station>);
    findAll(page?: number, limit?: number): Promise<[Station[], number]>;
    findOne(id: number): Promise<Station>;
    create(createStationDto: CreateStationDto): Promise<Station>;
    update(id: number, updateStationDto: UpdateStationDto): Promise<Station>;
    remove(id: number): Promise<void>;
}
