import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Sale } from '../entities/sale.entity';
import { Client } from '../entities/client.entity';
import { Station } from '../entities/station.entity';
import { Pump } from '../entities/pump.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { CreateWalkInClientDto } from './dto/create-walkin-client.dto';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private salesRepository: Repository<Sale>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(Station)
    private stationRepository: Repository<Station>,
    @InjectRepository(Pump)
    private pumpRepository: Repository<Pump>,
    private dataSource: DataSource,
  ) {}

  async createWalkInClient(walkInClientDto: CreateWalkInClientDto): Promise<Client> {
    // Generate a unique account number for walk-in client
    const timestamp = Date.now();
    const accountNumber = `WALK-${timestamp}`;
    
    const client = this.clientRepository.create({
      ...walkInClientDto,
      account_number: accountNumber,
      balance: 0.00, // Walk-in clients start with 0 balance
      client_type_Id: 1, // Walk-in client type
    });

    return await this.clientRepository.save(client);
  }

  async createSale(createSaleDto: CreateSaleDto, staffId: number): Promise<Sale> {
    console.log(`🔍 Creating sale with staff ID: ${staffId} (type: ${typeof staffId})`);
    console.log(`📦 Sale data:`, createSaleDto);
    
    // Validate staffId
    if (!staffId || isNaN(staffId) || staffId <= 0) {
      throw new BadRequestException('Invalid staff ID provided');
    }
    
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Validate client exists
      const client = await this.clientRepository.findOne({
        where: { id: createSaleDto.client_id }
      });
      if (!client) {
        throw new NotFoundException('Client not found');
      }

      // Validate station exists
      const station = await this.stationRepository.findOne({
        where: { id: createSaleDto.station_id }
      });
      if (!station) {
        throw new NotFoundException('Station not found');
      }

      // Create sale record
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

      // Update client ledger (for key accounts only)
      if (client.client_type_Id === 2) { // Key Account
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

      // Update station stock ledger
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

      // Update station store
      await queryRunner.manager.query(`
        UPDATE station_store 
        SET qty = qty - ?, updated_at = NOW()
        WHERE station_id = ? AND product_id = 1
      `, [createSaleDto.quantity, station.id]);

      await queryRunner.commitTransaction();
      return savedSale;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getSalesByStation(stationId: number): Promise<Sale[]> {
    return this.salesRepository.find({
      where: { station_id: stationId },
      relations: ['client', 'station', 'staff'],
      order: { created_at: 'DESC' },
    });
  }

  async getSalesByClient(clientId: number): Promise<Sale[]> {
    return this.salesRepository.find({
      where: { client_id: clientId },
      relations: ['client', 'station', 'staff'],
      order: { created_at: 'DESC' },
    });
  }

  async getSalesByStaff(staffId: number): Promise<Sale[]> {
    // Validate staffId is a valid number
    if (!staffId || isNaN(staffId) || staffId <= 0) {
      throw new BadRequestException('Invalid staff ID provided');
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
    } catch (error) {
      console.error(`❌ Error fetching sales for staff ID ${staffId}:`, error);
      throw error;
    }
  }

  async getSaleById(id: number): Promise<Sale> {
    // Validate id is a valid number
    if (!id || isNaN(id) || id <= 0) {
      throw new BadRequestException('Invalid sale ID provided');
    }

    console.log(`🔍 Fetching sale by ID: ${id} (type: ${typeof id})`);
    
    const sale = await this.salesRepository.findOne({
      where: { id },
      relations: ['client', 'station', 'staff'],
    });
    if (!sale) {
      throw new NotFoundException('Sale not found');
    }
    return sale;
  }

  async getPumpsByStation(stationId: number): Promise<Pump[]> {
    return this.pumpRepository.find({
      where: { station_id: stationId },
      order: { serial_number: 'ASC' },
    });
  }

  async getKeyAccountClients(): Promise<Client[]> {
    return this.clientRepository.find({
      where: { client_type_Id: 2 }, // Key Account
      order: { name: 'ASC' },
    });
  }

  async getWalkInClients(): Promise<Client[]> {
    return this.clientRepository.find({
      where: { client_type_Id: 1 }, // Walk In
      order: { name: 'ASC' },
    });
  }

  async getStationCurrentPrice(stationId: number): Promise<number> {
    const station = await this.stationRepository.findOne({
      where: { id: stationId },
      select: ['current_fuel_price'],
    });
    if (!station) {
      throw new NotFoundException('Station not found');
    }
    return station.current_fuel_price;
  }
}
