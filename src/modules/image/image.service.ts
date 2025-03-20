import { InjectRepository } from '@nestjs/typeorm';
import { ImageEntity } from './entities/image.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { MulterFile } from 'src/common/utils/multer.util';
import { ImageDto } from './dto/image.dto';

@Injectable()
export class ImageService {
  constructor(@InjectRepository(ImageEntity) private imageRepository: Repository<ImageEntity>) { }

  create(imageDto: ImageDto, image: MulterFile) {
    return image;
  }

  findAll() {
    return `This action returns all image`;
  }

  findOne(id: number) {
    return `This action returns a #${id} image`;
  }

  remove(id: number) {
    return `This action removes a #${id} image`;
  }
}
