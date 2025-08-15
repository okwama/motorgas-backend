import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { CreateWalkInClientDto } from './dto/create-walkin-client.dto';
export declare class SalesController {
    private readonly salesService;
    constructor(salesService: SalesService);
    createSale(createSaleDto: CreateSaleDto, req: any): Promise<import("../entities/sale.entity").Sale>;
    createWalkInClient(createWalkInClientDto: CreateWalkInClientDto): Promise<import("../entities/client.entity").Client>;
    getSalesByStation(stationId: string): Promise<import("../entities/sale.entity").Sale[]>;
    getSalesByClient(clientId: string): Promise<import("../entities/sale.entity").Sale[]>;
    getMySales(req: any): Promise<import("../entities/sale.entity").Sale[]>;
    getSalesByStaff(staffId: string): Promise<import("../entities/sale.entity").Sale[]>;
    getPumpsByStation(stationId: string): Promise<import("../entities/pump.entity").Pump[]>;
    getKeyAccountClients(): Promise<import("../entities/client.entity").Client[]>;
    getWalkInClients(): Promise<import("../entities/client.entity").Client[]>;
    getStationCurrentPrice(stationId: string): Promise<{
        current_price: number;
    }>;
    getSaleById(id: string): Promise<import("../entities/sale.entity").Sale>;
}
