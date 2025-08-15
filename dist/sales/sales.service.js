"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sale_entity_1 = require("../entities/sale.entity");
const client_entity_1 = require("../entities/client.entity");
const station_entity_1 = require("../entities/station.entity");
const pump_entity_1 = require("../entities/pump.entity");
let SalesService = class SalesService {
    salesRepository;
    clientRepository;
    stationRepository;
    pumpRepository;
    dataSource;
    constructor(salesRepository, clientRepository, stationRepository, pumpRepository, dataSource) {
        this.salesRepository = salesRepository;
        this.clientRepository = clientRepository;
        this.stationRepository = stationRepository;
        this.pumpRepository = pumpRepository;
        this.dataSource = dataSource;
    }
    async createWalkInClient(walkInClientDto) {
        const timestamp = Date.now();
        const accountNumber = `WALK-${timestamp}`;
        const client = this.clientRepository.create({
            ...walkInClientDto,
            account_number: accountNumber,
            balance: 0.00,
            client_type_Id: 1,
        });
        return await this.clientRepository.save(client);
    }
    async createSale(createSaleDto, staffId) {
        console.log(`🔍 Creating sale with staff ID: ${staffId} (type: ${typeof staffId})`);
        console.log(`📦 Sale data:`, createSaleDto);
        if (!staffId || isNaN(staffId) || staffId <= 0) {
            throw new common_1.BadRequestException('Invalid staff ID provided');
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const client = await this.clientRepository.findOne({
                where: { id: createSaleDto.client_id }
            });
            if (!client) {
                throw new common_1.NotFoundException('Client not found');
            }
            const station = await this.stationRepository.findOne({
                where: { id: createSaleDto.station_id }
            });
            if (!station) {
                throw new common_1.NotFoundException('Station not found');
            }
            const sale = this.salesRepository.create({
                ...createSaleDto,
                staff_id: staffId,
                sale_date: new Date(createSaleDto.sale_date),
            });
            console.log(`📝 Sale object before save:`, {
                client_id: sale.client_id,
                station_id: sale.station_id,
                staff_id: sale.staff_id,
                quantity: sale.quantity,
                total_price: sale.total_price,
                sale_date: sale.sale_date
            });
            const savedSale = await queryRunner.manager.save(sale);
            console.log(`✅ Sale saved with ID: ${savedSale.id}, staff_id: ${savedSale.staff_id}`);
            if (client.client_type_Id === 2) {
                await queryRunner.manager.query(`
          INSERT INTO client_ledger (client_id, amount_in, amount_out, balance, reference, date)
          VALUES (?, 0, ?, 
            (SELECT COALESCE(MAX(balance), 0) FROM client_ledger WHERE client_id = ?) - ?,
            ?, NOW())
        `, [
                    client.id,
                    createSaleDto.total_price,
                    client.id,
                    createSaleDto.total_price,
                    `Fuel sale - ${createSaleDto.quantity}L at ${createSaleDto.unit_price}/L from station ${station.name}`
                ]);
            }
            await queryRunner.manager.query(`
        INSERT INTO station_stock_ledger (station_id, quantity_in, quantity_out, balance, date, description)
        VALUES (?, 0, ?, 
          (SELECT COALESCE(MAX(balance), 0) FROM station_stock_ledger WHERE station_id = ?) - ?,
          NOW(), ?)
      `, [
                station.id,
                createSaleDto.quantity,
                station.id,
                createSaleDto.quantity,
                `Fuel sale - ${createSaleDto.quantity}L to client ${client.name}, vehicle ${createSaleDto.vehicle_id}`
            ]);
            await queryRunner.manager.query(`
        UPDATE station_store 
        SET qty = qty - ?, updated_at = NOW()
        WHERE station_id = ? AND product_id = 1
      `, [createSaleDto.quantity, station.id]);
            await queryRunner.commitTransaction();
            return savedSale;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async getSalesByStation(stationId) {
        return this.salesRepository.find({
            where: { station_id: stationId },
            relations: ['client', 'station', 'staff'],
            order: { created_at: 'DESC' },
        });
    }
    async getSalesByClient(clientId) {
        return this.salesRepository.find({
            where: { client_id: clientId },
            relations: ['client', 'station', 'staff'],
            order: { created_at: 'DESC' },
        });
    }
    async getSalesByStaff(staffId) {
        if (!staffId || isNaN(staffId) || staffId <= 0) {
            throw new common_1.BadRequestException('Invalid staff ID provided');
        }
        console.log(`🔍 Fetching sales for staff ID: ${staffId} (type: ${typeof staffId})`);
        try {
            const sales = await this.salesRepository.find({
                where: { staff_id: staffId },
                relations: ['client', 'station'],
                order: { created_at: 'DESC' },
            });
            console.log(`✅ Found ${sales.length} sales for staff ID: ${staffId}`);
            console.log(`📊 Sales data:`, sales.map(sale => ({
                id: sale.id,
                client: sale.client?.name,
                quantity: sale.quantity,
                total_price: sale.total_price,
                sale_date: sale.sale_date
            })));
            return sales;
        }
        catch (error) {
            console.error(`❌ Error fetching sales for staff ID ${staffId}:`, error);
            throw error;
        }
    }
    async getSaleById(id) {
        if (!id || isNaN(id) || id <= 0) {
            throw new common_1.BadRequestException('Invalid sale ID provided');
        }
        console.log(`🔍 Fetching sale by ID: ${id} (type: ${typeof id})`);
        const sale = await this.salesRepository.findOne({
            where: { id },
            relations: ['client', 'station', 'staff'],
        });
        if (!sale) {
            throw new common_1.NotFoundException('Sale not found');
        }
        return sale;
    }
    async getPumpsByStation(stationId) {
        return this.pumpRepository.find({
            where: { station_id: stationId },
            order: { serial_number: 'ASC' },
        });
    }
    async getKeyAccountClients() {
        return this.clientRepository.find({
            where: { client_type_Id: 2 },
            order: { name: 'ASC' },
        });
    }
    async getWalkInClients() {
        return this.clientRepository.find({
            where: { client_type_Id: 1 },
            order: { name: 'ASC' },
        });
    }
    async getStationCurrentPrice(stationId) {
        const station = await this.stationRepository.findOne({
            where: { id: stationId },
            select: ['current_fuel_price'],
        });
        if (!station) {
            throw new common_1.NotFoundException('Station not found');
        }
        return station.current_fuel_price;
    }
};
exports.SalesService = SalesService;
exports.SalesService = SalesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sale_entity_1.Sale)),
    __param(1, (0, typeorm_1.InjectRepository)(client_entity_1.Client)),
    __param(2, (0, typeorm_1.InjectRepository)(station_entity_1.Station)),
    __param(3, (0, typeorm_1.InjectRepository)(pump_entity_1.Pump)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], SalesService);
//# sourceMappingURL=sales.service.js.map