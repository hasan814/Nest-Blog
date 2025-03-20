import { BadRequestException, Inject, Injectable, Scope, UnauthorizedException } from '@nestjs/common';
import { createSlug, randomId } from 'src/common/utils/slug.util';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestWithUser } from 'src/common/types/request-with-user';
import { CreateBlogDto, FilterBlogDto } from './dto/blog.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { BadRequestMessage, PublicMessage } from 'src/common/enums/message.enum';
import { BlogEntity } from './entities/blog.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { BlogStatus } from './enum/status.enum';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { REQUEST } from '@nestjs/core';
import { paginationGenerator, paginationSolver } from 'src/common/utils/pagination.utils';
import { CategoryService } from '../category/category.service';
import { isArray } from 'class-validator';
import { BlogCategoryEntity } from './entities/blog-category.entity';
import { EntityName } from 'src/common/enums/entity.enums';

@Injectable({ scope: Scope.REQUEST })
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity) private blogRepository: Repository<BlogEntity>,
    @InjectRepository(BlogCategoryEntity) private blogCategoryRepository: Repository<BlogCategoryEntity>,
    @Inject(REQUEST) private request: RequestWithUser,
    private categoryService: CategoryService
  ) { }

  async create(blogDto: CreateBlogDto) {
    const user = this.request.user as UserEntity | undefined;
    if (!user) throw new UnauthorizedException("User not found in request.");
    let { title, slug, content, description, image, time_for_study, categories } = blogDto;
    if (!isArray(categories) && typeof categories === 'string') categories = categories.split(",")
    else if (!isArray(categories)) throw new BadRequestException(BadRequestMessage.InvalidCategories)
    blogDto.slug = createSlug(slug ?? title);
    const isExsit = await this.checkBlogBySlug(blogDto.slug)
    if (isExsit) slug += `-${randomId}`
    let blog = this.blogRepository.create({
      title,
      slug: blogDto.slug,
      description,
      content,
      image,
      status: BlogStatus.Draft,
      time_for_study,
      author: user
    });
    blog = await this.blogRepository.save(blog);
    for (const categoryTitle of categories) {
      let category = await this.categoryService.findOneByTitle(categoryTitle)
      if (!category) category = await this.categoryService.insertByTitle(categoryTitle)
      await this.blogCategoryRepository.insert({ blogId: blog.id, categoryId: category.id })
    }
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

  async blogList(paginationDto: PaginationDto, filterDto: FilterBlogDto) {
    const { limit, page, skip } = paginationSolver(paginationDto)
    let { category, search } = filterDto
    let where = ''
    if (category) {
      category = category.toLowerCase()
      if (where.length > 0) where += 'AND'
      where += 'category.title = LOWER(:category)'
    }
    if (search) {
      if (where.length > 0) where += 'AND'
      search = `%${search}%`
      where += 'CONCAT(blog.title, blog.description, blog.content) ILIKE:search'
    }
    const [blogs, count] = await this.blogRepository.createQueryBuilder(EntityName.Blog)
      .leftJoin("blog.categories", "categories")
      .leftJoin("categories.category", "category")
      .addSelect(['categories.id', 'category.title'])
      .where(where, { category, search })
      .orderBy('blog.id', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount()
    return { pagination: paginationGenerator(count, page, limit), blogs }
  }
}
