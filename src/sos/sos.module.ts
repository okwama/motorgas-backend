import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sos } from '../entities/sos.entity';
import { SosController } from './sos.controller';
import { SosService } from './sos.service';

@Module({
  imports: [TypeOrmModule.forFeature([Sos])],
  controllers: [SosController],
  providers: [SosService],
  exports: [SosService],
})
export class SosModule {} 