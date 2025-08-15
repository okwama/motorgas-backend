import { UploadService } from './upload.service';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    uploadProfileImage(file: Express.Multer.File): Promise<{
        success: boolean;
        data: {
            url: string;
            filename: string;
            size: number;
        };
        message: string;
    }>;
    uploadLeaveDocument(file: Express.Multer.File): Promise<{
        success: boolean;
        data: {
            url: string;
            filename: string;
            size: number;
        };
        message: string;
    }>;
    uploadGeneralFile(file: Express.Multer.File): Promise<{
        success: boolean;
        data: {
            url: string;
            filename: string;
            size: number;
        };
        message: string;
    }>;
}
