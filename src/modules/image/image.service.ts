import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { NotFoundMessage, PublicMessage } from 'src/common/enums/message.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageEntity } from './entities/image.entity';
import { Repository } from 'typeorm';
import { MulterFile } from 'src/common/utils/multer.util';
import { ImageDto } from './dto/image.dto';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.REQUEST })
export class ImageService {
  constructor(
    @InjectRepository(ImageEntity) private imageRepository: Repository<ImageEntity>,
    @Inject(REQUEST) private req: Request
  ) { }

  async create(imageDto: ImageDto, image: MulterFile) {
    const userId = this.req?.user?.id
    const { alt, name } = imageDto
    let location = image?.path?.slice(7)
    await this.imageRepository.insert({
      alt: alt || name,
      name,
      location,
      userId
    })
    return { message: PublicMessage.Created };
  }

  findAll() {
    const userId = this.req?.user?.id
    return this.imageRepository.find({ where: { userId }, order: { id: "DESC" } });
  }

  async findOne(id: number) {
    const userId = this.req?.user?.id
    const image = await this.imageRepository.find({
      where: { userId, id },
      order: { id: "DESC" }
    });
    if (!image) throw new NotFoundException(NotFoundMessage.NotFoundPost)
    return image
  }

  async remove(id: number) {
    const image = await this.findOne(id)
    await this.imageRepository.remove(image)
    return { message: PublicMessage.Deleted }
  }
}
