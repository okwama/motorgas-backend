import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('profile-image')
  @UseInterceptors(FileInterceptor('image', {
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.startsWith('image/')) {
        return cb(new BadRequestException('Only image files are allowed'), false);
      }
      cb(null, true);
    },
  }))
  async uploadProfileImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      const imageUrl = await this.uploadService.uploadProfileImage(file);
      return {
        success: true,
        data: {
          url: imageUrl,
          filename: file.originalname,
          size: file.size,
        },
        message: 'Profile image uploaded successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('leave-document')
  @UseInterceptors(FileInterceptor('document', {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
    },
    fileFilter: (req, file, cb) => {
      const allowedMimeTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png',
      ];
      
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(new BadRequestException('Invalid file type. Only PDF, DOC, DOCX, JPG, and PNG files are allowed'), false);
      }
      cb(null, true);
    },
  }))
  async uploadLeaveDocument(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      const documentUrl = await this.uploadService.uploadLeaveDocument(file);
      return {
        success: true,
        data: {
          url: documentUrl,
          filename: file.originalname,
          size: file.size,
        },
        message: 'Leave document uploaded successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('general-file')
  @UseInterceptors(FileInterceptor('file', {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
    },
  }))
  async uploadGeneralFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      const fileUrl = await this.uploadService.uploadGeneralFile(file);
      return {
        success: true,
        data: {
          url: fileUrl,
          filename: file.originalname,
          size: file.size,
        },
        message: 'File uploaded successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
} 