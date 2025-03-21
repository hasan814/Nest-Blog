import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException, Scope, UnauthorizedException } from '@nestjs/common';
import { BadRequestMessage, NotFoundMessage, PublicMessage } from 'src/common/enums/message.enum';
import { CreateBlogDto, FilterBlogDto, UpdateBlogDto } from '../dto/blog.dto';
import { paginationGenerator, paginationSolver } from 'src/common/utils/pagination.utils';
import { DataSource, Repository } from 'typeorm';
import { createSlug, randomId } from 'src/common/utils/slug.util';
import { BlogCommentService } from './comment.service';
import { BlogCategoryEntity } from '../entities/blog-category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestWithUser } from 'src/common/types/request-with-user';
import { CategoryService } from '../../category/category.service';
import { BlogLikesEntity } from '../entities/like.entity';
import { BlogBookEntity } from '../entities/bookmark.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { BlogStatus } from '../enum/status.enum';
import { BlogEntity } from '../entities/blog.entity';
import { EntityName } from 'src/common/enums/entity.enums';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { REQUEST } from '@nestjs/core';
import { isArray } from 'class-validator';


@Injectable({ scope: Scope.REQUEST })
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity) private blogRepository: Repository<BlogEntity>,
    @InjectRepository(BlogLikesEntity) private blogLikeRepository: Repository<BlogLikesEntity>,
    @Inject(forwardRef(() => BlogCommentService)) private blogCommentService: BlogCommentService,
    @InjectRepository(BlogBookEntity) private blogBookmarkRepository: Repository<BlogBookEntity>,
    @InjectRepository(BlogCategoryEntity) private blogCategoryRepository: Repository<BlogCategoryEntity>,
    @Inject(REQUEST) private request: RequestWithUser,
    private categoryService: CategoryService,
    private dataSource: DataSource
  ) { }

  async create(blogDto: CreateBlogDto) {
    const user = this.request.user as UserEntity | undefined;
    if (!user) throw new UnauthorizedException("User not found in request.");
    let { title, slug, content, description, image, time_for_study, categories } = blogDto;
    if (!Array.isArray(categories) && typeof categories === 'string') categories = categories.split(",");
    else if (!Array.isArray(categories)) throw new BadRequestException(BadRequestMessage.InvalidCategories);
    blogDto.slug = createSlug(slug ?? title);
    const isExsit = await this.checkBlogBySlug(blogDto.slug);
    if (isExsit) {
      slug += `-${randomId()}`;
      blogDto.slug = slug;
    }
    let blog = this.blogRepository.create({
      title,
      image,
      content,
      description,
      author: user,
      time_for_study,
      slug: blogDto.slug,
      status: BlogStatus.Draft,
    });
    blog = await this.blogRepository.save(blog);
    for (const categoryTitle of categories) {
      let category = await this.categoryService.findOneByTitle(categoryTitle);
      if (!category) category = await this.categoryService.insertByTitle(categoryTitle);
      await this.blogCategoryRepository.insert({ blogId: blog.id, categoryId: category.id });
    }
    return { message: PublicMessage.Created, blog };
  }

  async checkBlogBySlug(slug: string) {
    const blog = await this.blogRepository.findOneBy({ slug })
    return blog
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
      .leftJoin("blog.author", "author")
      .leftJoin("author.profile", "profile")
      .addSelect(['categories.id', 'category.title', 'author.username', 'author.id', 'profile.nick_name'])
      .where(where, { category, search })
      .loadRelationCountAndMap('blog.likes', 'blog.likes')
      .loadRelationCountAndMap('blog.bookmarks', 'blog.bookmarks')
      .loadRelationCountAndMap('blog.comments', 'blog.comments', 'comments', qb => qb.where("comments.accepted =:accepted", { accepted: true }))
      .orderBy('blog.id', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount()
    return { pagination: paginationGenerator(count, page, limit), blogs }
  }

  async checkExistBlogById(id: number) {
    const blog = await this.blogRepository.findOneBy({ id })
    if (!blog) throw new NotFoundException(NotFoundMessage.NotFoundPost)
    return blog
  }

  async delete(id: number) {
    await this.checkExistBlogById(id)
    await this.blogRepository.delete({ id })
    return { message: PublicMessage.Deleted }
  }

  async update(id: number, blogDto: UpdateBlogDto) {
    const user = this.request.user as UserEntity | undefined;
    if (!user) throw new UnauthorizedException("User not found in request.");
    let { title, slug, content, description, image, time_for_study, categories } = blogDto;
    const blog = await this.checkExistBlogById(id);
    if (!Array.isArray(categories) && typeof categories === 'string') categories = categories.split(",");
    else if (!Array.isArray(categories)) throw new BadRequestException(BadRequestMessage.InvalidCategories);
    let slugData = title ?? slug;
    if (title) blog.title = title;
    if (slug) slugData = slug;
    if (slugData) {
      const newSlug = createSlug(slugData);
      const isExist = await this.checkBlogBySlug(newSlug);
      if (isExist && isExist.id !== id) {
        slug = `${newSlug}-${randomId()}`;
      } else {
        slug = newSlug;
      }
      blog.slug = slug;
    }
    if (description) blog.description = description;
    if (content) blog.content = content;
    if (image) blog.image = image;
    if (time_for_study) blog.time_for_study = time_for_study;
    await this.blogRepository.save(blog);
    if (categories && isArray(categories) && categories.length > 0)
      await this.blogCategoryRepository.delete({ blogId: blog.id })
    for (const categoryTitle of categories) {
      let category = await this.categoryService.findOneByTitle(categoryTitle);
      if (!category) category = await this.categoryService.insertByTitle(categoryTitle);
      await this.blogCategoryRepository.insert({ blogId: blog.id, categoryId: category.id })

    }
    return { message: PublicMessage.Updated, blog };
  }

  async likeToggle(blogId: number) {
    const { id: userId } = this.request.user as UserEntity;
    const blog = await this.checkExistBlogById(blogId);
    const isLiked = await this.blogLikeRepository.findOneBy({ userId, blogId });
    let message = PublicMessage.Like;
    if (isLiked) {
      await this.blogLikeRepository.delete({ id: isLiked.id });
      message = PublicMessage.Dislike;
    } else {
      await this.blogLikeRepository.insert({ blogId, userId });
    }
    return { message };
  }

  async bookmarkToggle(blogId: number) {
    const { id: userId } = this.request.user as UserEntity;
    const blog = await this.checkExistBlogById(blogId);
    const isBookmarked = await this.blogBookmarkRepository.findOneBy({ userId, blogId });
    let message = PublicMessage.Bookmark;
    if (isBookmarked) {
      await this.blogBookmarkRepository.delete({ id: isBookmarked.id });
      message = PublicMessage.unBookmark;
    } else {
      await this.blogBookmarkRepository.insert({ blogId, userId });
    }
    return { message };
  }

  async findOneBySlug(slug: string, paginationDto: PaginationDto) {
    const userId = this.request?.user?.id;
    const blog = await this.blogRepository.createQueryBuilder(EntityName.Blog)
      .leftJoin("blog.categories", "categories")
      .leftJoin("categories.category", "category")
      .leftJoin("blog.author", "author")
      .leftJoin("author.profile", "profile")
      .addSelect(['categories.id', 'category.title', 'author.username', 'author.id', 'profile.nick_name'])
      .where({ slug })
      .loadRelationCountAndMap('blog.likes', 'blog.likes')
      .loadRelationCountAndMap('blog.bookmarks', 'blog.bookmarks')
      .getOne();

    if (!blog) throw new NotFoundException(NotFoundMessage.NotFoundPost);

    const commentsData = await this.blogCommentService.findCommentsOfBlog(blog.id, paginationDto);

    let isLiked = false;
    let isBookmarked = false;
    if (userId && !isNaN(userId) && userId > 0) {
      isLiked = !!(await this.blogLikeRepository.findOneBy({ userId, blogId: blog.id }));
      isBookmarked = !!(await this.blogBookmarkRepository.findOneBy({ userId, blogId: blog.id }));
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    const suggestBlogs = await queryRunner.query(`
      WITH suggested_blogs AS (
        SELECT
          blog.id,
          blog.slug,
          blog.image,
          blog.title,
          blog.description,
          blog.time_for_study,
          json_build_object(
            'username', u.username,
            'author_name', p.nick_name,
            'image', p.image_profile
          ) AS author,
          array_agg(DISTINCT cat.title) AS categories,
          (
            SELECT COUNT(*) FROM blog_likes
            WHERE blog_likes."blogId" = blog.id
          ) AS likes,
          (
            SELECT COUNT(*) FROM blog_bookmarks
            WHERE blog_bookmarks."blogId" = blog.id
          ) AS bookmarks,
          (
            SELECT COUNT(*) FROM blog_comments
            WHERE blog_comments."blogId" = blog.id
          ) AS comments
        FROM blog
        LEFT JOIN public.user u ON blog."authorId" = u.id  
        LEFT JOIN profile p ON p."userId" = u.id  
        LEFT JOIN blog_category bc ON blog.id = bc."blogId"  
        LEFT JOIN category cat ON bc."categoryId" = cat.id  
        GROUP BY blog.id, u.username, p.nick_name, p.image_profile
        ORDER BY RANDOM()
        LIMIT 3
      )
      SELECT * FROM suggested_blogs
    `);

    return { blog, isLiked, isBookmarked, commentsData, suggestBlogs };
  }

}
