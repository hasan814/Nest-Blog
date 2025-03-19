import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enums';
import { CreateBlogDto } from './dto/blog.dto';
import { BlogService } from './blog.service';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('blog')
@ApiTags("Blog")
@ApiBearerAuth("Authorization")
@UseGuards(AuthGuard)
export class BlogController {
  constructor(private readonly blogService: BlogService) { }

  @Post("/")
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  create(@Body() blogDto: CreateBlogDto) {
    return this.blogService.create(blogDto)
  }
}
