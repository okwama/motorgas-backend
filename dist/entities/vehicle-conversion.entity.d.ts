export declare enum ConversionType {
    FULL = "Full",
    PARTIAL = "Partial"
}
export declare class VehicleConversion {
    id: number;
    vehiclePlate: string;
    vehicleType: string;
    conversionType: ConversionType;
    amountCharged: number;
    serviceDate: Date;
    comment?: string;
    createdAt: Date;
}
