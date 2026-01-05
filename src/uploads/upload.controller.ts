import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { localFileStorage } from '../common/utils/file-upload';

@Controller('uploads')
export class UploadController {
  @Post('image')
  @UseInterceptors(FileInterceptor('file', localFileStorage))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return { message: 'Uploaded', url: `/uploads/${file.filename}`, filename: file.filename };
  }
}
