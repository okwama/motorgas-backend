import { SosService } from './sos.service';
import { CreateSosDto } from './dto/create-sos.dto';
import { UpdateSosDto } from './dto/update-sos.dto';
export declare class SosController {
    private readonly sosService;
    constructor(sosService: SosService);
    findAll(page?: number, limit?: number): Promise<{
        data: import("../entities/sos.entity").Sos[];
        total: number;
        page: number;
        limit: number;
        total_pages: number;
    }>;
    findActive(): Promise<{
        data: import("../entities/sos.entity").Sos[];
        total: number;
    }>;
    findByGuard(guardId: string): Promise<{
        data: import("../entities/sos.entity").Sos[];
        total: number;
    }>;
    findOne(id: string): Promise<import("../entities/sos.entity").Sos>;
    create(createSosDto: CreateSosDto): Promise<import("../entities/sos.entity").Sos>;
    update(id: string, updateSosDto: UpdateSosDto): Promise<import("../entities/sos.entity").Sos>;
    remove(id: string): Promise<void>;
}
