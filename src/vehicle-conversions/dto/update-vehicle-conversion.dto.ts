import { PartialType } from '@nestjs/mapped-types';
import { CreateVehicleConversionDto } from './create-vehicle-conversion.dto';

export class UpdateVehicleConversionDto extends PartialType(CreateVehicleConversionDto) {}
