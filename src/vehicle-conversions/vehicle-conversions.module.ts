import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleConversionsService } from './vehicle-conversions.service';
import { VehicleConversionsController } from './vehicle-conversions.controller';
import { VehicleConversion } from '../entities/vehicle-conversion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VehicleConversion])],
  controllers: [VehicleConversionsController],
  providers: [VehicleConversionsService],
})
export class VehicleConversionsModule {}
