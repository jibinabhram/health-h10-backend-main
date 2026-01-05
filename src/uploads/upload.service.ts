import { Injectable } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { promises as fs } from 'fs';
import { join } from 'path';

@Injectable()
export class UploadService {
  private uploadsDir = join(process.cwd(), 'uploads');

  async storeFile(file: Express.Multer.File) {
    // multer already saved file; return url
    return { filename: file.filename, url: `/uploads/${file.filename}` };
  }

  async ensureUploads() {
    try {
      await fs.access(this.uploadsDir);
    } catch {
      await fs.mkdir(this.uploadsDir);
    }
  }

  static localStorage() {
    return diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${unique}${extname(file.originalname)}`);
      },
    });
  }
}
