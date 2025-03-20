import { BadRequestException, Inject, Injectable, Scope } from '@nestjs/common';
import { BlogCommentEntity } from '../entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCommentDto } from '../dto/comment.dto';
import { RequestWithUser } from 'src/common/types/request-with-user';
import { PublicMessage } from 'src/common/enums/message.enum';
import { BlogService } from './blog.service';
import { Repository } from 'typeorm';
import { BlogEntity } from '../entities/blog.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { REQUEST } from '@nestjs/core';


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

}
