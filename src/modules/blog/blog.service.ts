import { InjectRepository } from '@nestjs/typeorm';
import { CreateBlogDto } from './dto/blog.dto';
import { Injectable } from '@nestjs/common';
import { BlogEntity } from './entities/blog.entity';
import { Repository } from 'typeorm';
import { createSlug } from 'src/common/utils/slug.util';

@Injectable()
export class BlogService {
  constructor(@InjectRepository(BlogEntity) private blogService: Repository<BlogEntity>) { }

  create(blogDto: CreateBlogDto) {
    let { title, slug } = blogDto;
    let slugData = slug ?? title;
    blogDto.slug = createSlug(slugData);
    return blogDto;
  }

}
