import { BlogCategoryEntity } from './entities/blog-category.entity';
import { CategoryService } from '../category/category.service';
import { BlogLikesEntity } from './entities/like.entity';
import { BlogController } from './blog.controller';
import { CategoryEntity } from '../category/entities/category.entity';
import { BlogBookEntity } from './entities/bookmark.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogService } from './blog.service';
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
      BlogCategoryEntity,
    ])],
  controllers: [BlogController],
  providers: [BlogService, CategoryService],
})
export class BlogModule { }
