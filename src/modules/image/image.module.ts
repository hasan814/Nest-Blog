import { ImageController } from './image.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageService } from './image.service';
import { ImageEntity } from './entities/image.entity';
import { AuthModule } from '../auth/auth.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([ImageEntity])],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule { }
