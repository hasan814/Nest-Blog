import { BlogCategoryEntity } from './entities/blog-category.entity';
import { CategoryService } from '../category/category.service';
import { BlogController } from './blog.controller';
import { CategoryEntity } from '../category/entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogService } from './blog.service';
import { AuthModule } from '../auth/auth.module';
import { BlogEntity } from './entities/blog.entity';
import { Module } from '@nestjs/common';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([BlogEntity, CategoryEntity, BlogCategoryEntity])],
  controllers: [BlogController],
  providers: [BlogService, CategoryService],
})
export class BlogModule { }
