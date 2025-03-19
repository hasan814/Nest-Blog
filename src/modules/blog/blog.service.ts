import { Inject, Injectable, Scope, UnauthorizedException } from '@nestjs/common';
import { createSlug, randomId } from 'src/common/utils/slug.util';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestWithUser } from 'src/common/types/request-with-user';
import { CreateBlogDto } from './dto/blog.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { PublicMessage } from 'src/common/enums/message.enum';
import { BlogEntity } from './entities/blog.entity';
import { Repository } from 'typeorm';
import { BlogStatus } from './enum/status.enum';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { REQUEST } from '@nestjs/core';
import { paginationGenerator, paginationSolver } from 'src/common/utils/pagination.utils';

@Injectable({ scope: Scope.REQUEST })
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity) private blogRepository: Repository<BlogEntity>,
    @Inject(REQUEST) private request: RequestWithUser
  ) { }

  async create(blogDto: CreateBlogDto) {
    const user = this.request.user as UserEntity | undefined;
    if (!user) throw new UnauthorizedException("User not found in request.");
    let { title, slug, content, description, image, time_for_study } = blogDto;
    blogDto.slug = createSlug(slug ?? title);
    const isExsit = await this.checkBlogBySlug(blogDto.slug)
    if (isExsit) slug += `-${randomId}`
    const blog = this.blogRepository.create({
      title,
      slug: blogDto.slug,
      description,
      content,
      image,
      status: BlogStatus.Draft,
      time_for_study,
      author: user
    });
    await this.blogRepository.save(blog);
    return { message: PublicMessage.Created, blog };
  }

  async checkBlogBySlug(slug: string) {
    const blog = await this.blogRepository.findOneBy({ slug })
    return !!blog
  }

  async myBlog() {
    const { id } = this.request.user as UserEntity
    return this.blogRepository.find({ where: { authorId: id }, order: { id: "DESC" } })
  }

  async blogList(paginationDto: PaginationDto) {
    const { limit, page, skip } = paginationSolver(paginationDto)
    const [blogs, count] = await this.blogRepository.findAndCount({
      where: {},
      order: { id: "DESC" },
      skip,
      take: limit
    })
    return { pagination: paginationGenerator(count, page, limit), blogs }
  }
}
