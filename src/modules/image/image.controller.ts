import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enums';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';
import { ImageService } from './image.service';
import { MulterFile } from 'src/common/utils/multer.util';
import { UploadFile } from 'src/common/interceptors/upload.interceptor';
import { ImageDto } from './dto/image.dto';

@Controller('image')
@ApiTags("image")
@AuthDecorator()
export class ImageController {
  constructor(private readonly imageService: ImageService) { }

  @Post()
  @UseInterceptors(UploadFile('image'))
  @ApiConsumes(SwaggerConsumes.MultipartData)
  create(@Body() imageDto: ImageDto, @UploadedFile() image: MulterFile) {
    return this.imageService.create(imageDto, image);
  }

  @Get()
  findAll() {
    return this.imageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imageService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imageService.remove(+id);
  }
}
