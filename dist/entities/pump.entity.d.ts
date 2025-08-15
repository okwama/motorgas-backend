import { Station } from './station.entity';
export declare class Pump {
    id: number;
    station_id: number;
    serial_number: string;
    description: string;
    created_at: Date;
    updated_at: Date;
    station: Station;
}
