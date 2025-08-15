import { PartialType } from '@nestjs/mapped-types';
import { CreateSosDto } from './create-sos.dto';

export class UpdateSosDto extends PartialType(CreateSosDto) {}
