import { BlogCommentController } from './controllers/comment.controller';
import { BlogCategoryEntity } from './entities/blog-category.entity';
import { BlogCommentService } from './services/comment.service';
import { BlogCommentEntity } from './entities/comment.entity';
import { CategoryService } from '../category/category.service';
import { BlogLikesEntity } from './entities/like.entity';
import { BlogController } from './controllers/blog.controller';
import { CategoryEntity } from '../category/entities/category.entity';
import { BlogBookEntity } from './entities/bookmark.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogService } from './services/blog.service';
import { AuthModule } from '../auth/auth.module';
import { BlogEntity } from './entities/blog.entity';
import { Module } from '@nestjs/common';

@Module({
  imports: [AuthModule,
    TypeOrmModule.forFeature([
      BlogEntity,
      CategoryEntity,
      BlogBookEntity,
      BlogLikesEntity,
      BlogCommentEntity,
      BlogCategoryEntity,
    ])],
  controllers: [BlogController, BlogCommentController],
  providers: [BlogService, CategoryService, BlogCommentService],
})
export class BlogModule { }
