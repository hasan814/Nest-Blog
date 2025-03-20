import { BadRequestException, Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { BlogCommentEntity } from '../entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCommentDto } from '../dto/comment.dto';
import { RequestWithUser } from 'src/common/types/request-with-user';
import { BadRequestMessage, NotFoundMessage, PublicMessage } from 'src/common/enums/message.enum';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { BlogService } from './blog.service';
import { Repository } from 'typeorm';
import { BlogEntity } from '../entities/blog.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { REQUEST } from '@nestjs/core';
import { paginationGenerator, paginationSolver } from 'src/common/utils/pagination.utils';


@Injectable({ scope: Scope.REQUEST })
export class BlogCommentService {
  constructor(
    @InjectRepository(BlogEntity) private blogRepository: Repository<BlogEntity>,
    @InjectRepository(BlogCommentEntity) private blogCommentRepository: Repository<BlogCommentEntity>,
    @Inject(REQUEST) private request: RequestWithUser,
    private blogService: BlogService
  ) { }

  async create(commentDto: CreateCommentDto) {
    const { parentId, text, blogId } = commentDto;
    const { id: userId } = this.request.user as UserEntity;
    const blog = await this.blogService.checkExistBlogById(blogId);
    let parent: BlogCommentEntity | null = null;
    if (parentId && !isNaN(parentId)) {
      parent = await this.blogCommentRepository.findOneBy({ id: +parentId });
      if (!parent) throw new BadRequestException("Parent comment not found.");
    }
    const comment = await this.blogCommentRepository.insert({
      text,
      accepted: true,
      blogId,
      parentId: parent ? parent.id : undefined,
      userId,
    });
    return { message: PublicMessage.CreatedComment, comment };
  }

  async find(paginationDto: PaginationDto) {
    const { limit, page, skip } = paginationSolver(paginationDto)
    const [comments, count] = await this.blogCommentRepository.findAndCount({
      where: {},
      relations: {
        blog: true,
        user: { profile: true }
      },
      select: {
        blog: { title: true },
        user: { username: true, profile: { nick_name: true } }
      },
      skip,
      take: limit,
      order: { id: "DESC" }
    })
    return { pagination: paginationGenerator(count, page, limit), comments }
  }

  async checkExistById(id: number) {
    const comment = await this.blogCommentRepository.findOneBy({ id })
    if (!comment) throw new NotFoundException(NotFoundMessage.NotFoundPost)
    return comment
  }

  async accept(id: number) {
    const comment = await this.checkExistById(id)
    if (comment.accepted) throw new BadRequestException(BadRequestMessage.AlreadyAccepted)
    comment.accepted = true
    await this.blogCommentRepository.save(comment)
    return { message: PublicMessage.Updated }
  }

  async reject(id: number) {
    const comment = await this.checkExistById(id)
    if (!comment.accepted) throw new BadRequestException(BadRequestMessage.AlreadyRejected)
    comment.accepted = true
    await this.blogCommentRepository.save(comment)
    return { message: PublicMessage.Updated }
  }

}
