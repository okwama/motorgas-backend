import { Repository, DataSource } from 'typeorm';
import { Sale } from '../entities/sale.entity';
import { Client } from '../entities/client.entity';
import { Station } from '../entities/station.entity';
import { Pump } from '../entities/pump.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { CreateWalkInClientDto } from './dto/create-walkin-client.dto';
export declare class SalesService {
    private salesRepository;
    private clientRepository;
    private stationRepository;
    private pumpRepository;
    private dataSource;
    constructor(salesRepository: Repository<Sale>, clientRepository: Repository<Client>, stationRepository: Repository<Station>, pumpRepository: Repository<Pump>, dataSource: DataSource);
    createWalkInClient(walkInClientDto: CreateWalkInClientDto): Promise<Client>;
    createSale(createSaleDto: CreateSaleDto, staffId: number): Promise<Sale>;
    getSalesByStation(stationId: number): Promise<Sale[]>;
    getSalesByClient(clientId: number): Promise<Sale[]>;
    getSalesByStaff(staffId: number): Promise<Sale[]>;
    getSaleById(id: number): Promise<Sale>;
    getPumpsByStation(stationId: number): Promise<Pump[]>;
    getKeyAccountClients(): Promise<Client[]>;
    getWalkInClients(): Promise<Client[]>;
    getStationCurrentPrice(stationId: number): Promise<number>;
}
