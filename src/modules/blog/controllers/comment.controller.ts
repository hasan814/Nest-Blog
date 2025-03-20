import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { BlogCommentService } from "../services/comment.service";
import { CreateCommentDto } from "../dto/comment.dto";
import { SwaggerConsumes } from "src/common/enums/swagger-consumes.enums";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { Pagination } from "src/common/decorators/pagination.decorator";
import { AuthGuard } from "src/modules/auth/guards/auth.guard";


@Controller('blog-comment')
@ApiTags("Blog")
@ApiBearerAuth("Authorization")
@UseGuards(AuthGuard)
export class BlogCommentController {
  constructor(private readonly blogCommentService: BlogCommentService) { }

  @Get("/")
  @Pagination()
  find(@Query() paginationDto: PaginationDto) {
    return this.blogCommentService.find(paginationDto)
  }

  @Post("/")
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  create(@Body() commentDto: CreateCommentDto) {
    return this.blogCommentService.create(commentDto)
  }

  @Put('/accept/:id')
  accept(@Param("id", ParseIntPipe) id: number) {
    return this.blogCommentService.accept(id)
  }

  @Put('/reject/:id')
  reject(@Param("id", ParseIntPipe) id: number) {
    return this.blogCommentService.reject(id)
  }

}