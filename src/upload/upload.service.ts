import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: this.configService.get('cloudinary.cloudName'),
      api_key: this.configService.get('cloudinary.apiKey'),
      api_secret: this.configService.get('cloudinary.apiSecret'),
    });
  }

  async uploadProfileImage(file: Express.Multer.File): Promise<string> {
    try {
      const result = await this.uploadToCloudinary(file, 'motor_gas/profiles');
      return result.secure_url;
    } catch (error) {
      throw new Error(`Failed to upload profile image: ${error.message}`);
    }
  }

  async uploadLeaveDocument(file: Express.Multer.File): Promise<string> {
    try {
      const result = await this.uploadToCloudinary(file, 'motor_gas/leave_documents');
      return result.secure_url;
    } catch (error) {
      throw new Error(`Failed to upload leave document: ${error.message}`);
    }
  }

  async uploadGeneralFile(file: Express.Multer.File, folder: string = 'motor_gas/general'): Promise<string> {
    try {
      const result = await this.uploadToCloudinary(file, folder);
      return result.secure_url;
    } catch (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  private async uploadToCloudinary(file: Express.Multer.File, folder: string): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'auto',
          transformation: [
            { width: 512, height: 512, crop: 'fill', quality: 'auto' }
          ]
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result as UploadApiResponse);
          }
        }
      );

      // Convert buffer to stream
      const readableStream = new Readable();
      readableStream.push(file.buffer);
      readableStream.push(null);
      readableStream.pipe(uploadStream);
    });
  }

  async deleteFile(publicId: string): Promise<boolean> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === 'ok';
    } catch (error) {
      console.error('Failed to delete file:', error);
      return false;
    }
  }
} 