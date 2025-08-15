import { Client } from './client.entity';
import { Station } from './station.entity';
import { Staff } from './staff.entity';
export declare class Sale {
    id: number;
    client_id: number;
    station_id: number;
    vehicle_id: number;
    quantity: number;
    unit_price: number;
    total_price: number;
    sale_date: Date;
    staff_id: number;
    created_at: Date;
    client: Client;
    station: Station;
    staff: Staff;
}
