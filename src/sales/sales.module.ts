import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { Sale } from '../entities/sale.entity';
import { Client } from '../entities/client.entity';
import { Station } from '../entities/station.entity';
import { Pump } from '../entities/pump.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sale, Client, Station, Pump])],
  controllers: [SalesController],
  providers: [SalesService],
  exports: [SalesService],
})
export class SalesModule {}
