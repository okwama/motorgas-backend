import { ConfigService } from '@nestjs/config';
export declare class UploadService {
    private configService;
    constructor(configService: ConfigService);
    uploadProfileImage(file: Express.Multer.File): Promise<string>;
    uploadLeaveDocument(file: Express.Multer.File): Promise<string>;
    uploadGeneralFile(file: Express.Multer.File, folder?: string): Promise<string>;
    private uploadToCloudinary;
    deleteFile(publicId: string): Promise<boolean>;
}
