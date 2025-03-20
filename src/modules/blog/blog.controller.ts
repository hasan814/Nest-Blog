import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enums';
import { CreateBlogDto, FilterBlogDto } from './dto/blog.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { BlogService } from './blog.service';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { SkipAuth } from 'src/common/decorators/skip-auth.decorator';
import { FilterBlog } from 'src/common/decorators/filter.decorator';

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

  @Get("/my")
  myBlogs() {
    return this.blogService.myBlog()
  }

  @Get("/")
  @SkipAuth()
  @Pagination()
  @FilterBlog()
  find(@Query() paginationDto: PaginationDto, @Query() filterDto: FilterBlogDto) {
    return this.blogService.blogList(paginationDto, filterDto)
  }
}
