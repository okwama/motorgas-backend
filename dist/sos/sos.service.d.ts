import { Repository } from 'typeorm';
import { Sos } from '../entities/sos.entity';
import { CreateSosDto } from './dto/create-sos.dto';
import { UpdateSosDto } from './dto/update-sos.dto';
export declare class SosService {
    private sosRepository;
    constructor(sosRepository: Repository<Sos>);
    findAll(page?: number, limit?: number): Promise<[Sos[], number]>;
    findActive(): Promise<[Sos[], number]>;
    findByStaff(staffId: number): Promise<[Sos[], number]>;
    findOne(id: number): Promise<Sos>;
    create(createSosDto: CreateSosDto): Promise<Sos>;
    update(id: number, updateSosDto: UpdateSosDto): Promise<Sos>;
    remove(id: number): Promise<void>;
}
