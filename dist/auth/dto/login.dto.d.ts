export declare class DeviceInfoDto {
    deviceId?: string;
    appVersion?: string;
    locationInfo?: string;
}
export declare class LoginDto {
    phone: string;
    password: string;
    deviceInfo?: DeviceInfoDto;
}
