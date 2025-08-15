import { Staff } from './staff.entity';
export declare class Station {
    id: number;
    name: string;
    address: string;
    phone: string;
    email: string;
    current_fuel_price: number;
    created_at: Date;
    updated_at: Date;
    staff: Staff[];
}
