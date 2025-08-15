import { StationsService } from './stations.service';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
export declare class StationsController {
    private readonly stationsService;
    constructor(stationsService: StationsService);
    findAll(page?: number, limit?: number): Promise<{
        data: import("../entities/station.entity").Station[];
        total: number;
        page: number;
        limit: number;
        total_pages: number;
    }>;
    findOne(id: string): Promise<import("../entities/station.entity").Station>;
    create(createStationDto: CreateStationDto): Promise<import("../entities/station.entity").Station>;
    update(id: string, updateStationDto: UpdateStationDto): Promise<import("../entities/station.entity").Station>;
    remove(id: string): Promise<void>;
}
