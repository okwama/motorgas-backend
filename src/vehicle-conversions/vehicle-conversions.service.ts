import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleConversion } from '../entities/vehicle-conversion.entity';
import { CreateVehicleConversionDto } from './dto/create-vehicle-conversion.dto';
import { UpdateVehicleConversionDto } from './dto/update-vehicle-conversion.dto';
import { QueryVehicleConversionDto } from './dto/query-vehicle-conversion.dto';

@Injectable()
export class VehicleConversionsService {
  constructor(
    @InjectRepository(VehicleConversion)
    private vehicleConversionRepository: Repository<VehicleConversion>,
  ) {}

  async create(createVehicleConversionDto: CreateVehicleConversionDto): Promise<VehicleConversion> {
    console.log('Creating conversion with DTO:', JSON.stringify(createVehicleConversionDto, null, 2));
    
    const conversion = this.vehicleConversionRepository.create({
      vehiclePlate: createVehicleConversionDto.vehicle_plate,
      vehicleType: createVehicleConversionDto.vehicle_type,
      conversionType: createVehicleConversionDto.conversion_type,
      amountCharged: createVehicleConversionDto.amount_charged,
      serviceDate: new Date(createVehicleConversionDto.service_date),
      comment: createVehicleConversionDto.comment,
    });
    
    console.log('Created entity:', JSON.stringify(conversion, null, 2));
    return await this.vehicleConversionRepository.save(conversion);
  }

  async findAll(queryDto: QueryVehicleConversionDto): Promise<[VehicleConversion[], number]> {
    const queryBuilder = this.vehicleConversionRepository.createQueryBuilder('conversion');

    if (queryDto.start_date) {
      queryBuilder.andWhere('conversion.serviceDate >= :startDate', {
        startDate: new Date(queryDto.start_date),
      });
    }

    if (queryDto.end_date) {
      queryBuilder.andWhere('conversion.serviceDate <= :endDate', {
        endDate: new Date(queryDto.end_date),
      });
    }

    if (queryDto.conversion_type) {
      queryBuilder.andWhere('conversion.conversionType = :conversionType', {
        conversionType: queryDto.conversion_type,
      });
    }

    queryBuilder.orderBy('conversion.createdAt', 'DESC');

    return await queryBuilder.getManyAndCount();
  }

  async findOne(id: number): Promise<VehicleConversion> {
    const conversion = await this.vehicleConversionRepository.findOne({
      where: { id },
    });

    if (!conversion) {
      throw new Error('Vehicle conversion not found');
    }

    return conversion;
  }

  async update(id: number, updateVehicleConversionDto: UpdateVehicleConversionDto): Promise<VehicleConversion> {
    const conversion = await this.findOne(id);

    if (updateVehicleConversionDto.service_date) {
      conversion.serviceDate = new Date(updateVehicleConversionDto.service_date);
    }

    // Map snake_case DTO fields to camelCase entity fields
    if (updateVehicleConversionDto.vehicle_plate) {
      conversion.vehiclePlate = updateVehicleConversionDto.vehicle_plate;
    }
    if (updateVehicleConversionDto.vehicle_type) {
      conversion.vehicleType = updateVehicleConversionDto.vehicle_type;
    }
    if (updateVehicleConversionDto.conversion_type) {
      conversion.conversionType = updateVehicleConversionDto.conversion_type;
    }
    if (updateVehicleConversionDto.amount_charged) {
      conversion.amountCharged = updateVehicleConversionDto.amount_charged;
    }
    if (updateVehicleConversionDto.comment !== undefined) {
      conversion.comment = updateVehicleConversionDto.comment;
    }

    return await this.vehicleConversionRepository.save(conversion);
  }

  async remove(id: number): Promise<void> {
    const conversion = await this.findOne(id);
    await this.vehicleConversionRepository.remove(conversion);
  }

  async getStats(queryDto: QueryVehicleConversionDto): Promise<any> {
    const queryBuilder = this.vehicleConversionRepository.createQueryBuilder('conversion');

    if (queryDto.start_date) {
      queryBuilder.andWhere('conversion.serviceDate >= :startDate', {
        startDate: new Date(queryDto.start_date),
      });
    }

    if (queryDto.end_date) {
      queryBuilder.andWhere('conversion.serviceDate <= :endDate', {
        endDate: new Date(queryDto.end_date),
      });
    }

    const totalConversions = await queryBuilder.getCount();
    const totalAmount = await queryBuilder
      .select('SUM(conversion.amountCharged)', 'total')
      .getRawOne();

    const fullConversions = await queryBuilder
      .andWhere('conversion.conversionType = :type', { type: 'Full' })
      .getCount();

    const partialConversions = await queryBuilder
      .andWhere('conversion.conversionType = :type', { type: 'Partial' })
      .getCount();

    return {
      totalConversions,
      totalAmount: parseFloat(totalAmount?.total || '0'),
      fullConversions,
      partialConversions,
      averageAmount: totalConversions > 0 ? parseFloat(totalAmount?.total || '0') / totalConversions : 0,
    };
  }
}
