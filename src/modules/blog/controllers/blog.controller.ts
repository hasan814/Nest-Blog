import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { CreateBlogDto, FilterBlogDto, UpdateBlogDto } from '../dto/blog.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enums';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { BlogService } from '../services/blog.service';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { FilterBlog } from 'src/common/decorators/filter.decorator';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { SkipAuth } from 'src/common/decorators/skip-auth.decorator';
import { Roles } from 'src/common/enums/role.enum';
import { CanAccess } from 'src/common/decorators/role.decorator';

@Controller('blog')
@ApiTags("Blog")
@AuthDecorator()
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

  @Get("/by-slug/:slug")
  @SkipAuth()
  @Pagination()
  findOneBySlug(@Param("slug") slug: string, @Query() paginationDto: PaginationDto) {
    return this.blogService.findOneBySlug(slug, paginationDto)
  }

  @Get("/like/:id")
  likeToggle(@Param("id", ParseIntPipe) id: number) {
    return this.blogService.likeToggle(id)
  }

  @Get("/bookmark/:id")
  bookmarkToggle(@Param("id", ParseIntPipe) id: number) {
    return this.blogService.bookmarkToggle(id)
  }

  @Delete("/:id")
  @CanAccess(Roles.Admin)
  delete(@Param("id", ParseIntPipe) id: number) {
    return this.blogService.delete(id)
  }

  @Put("/:id")
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  update(@Param("id", ParseIntPipe) id: number, @Body() blogDto: UpdateBlogDto) {
    return this.blogService.update(id, blogDto)
  }

}
