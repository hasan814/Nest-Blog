import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { PublicMessage } from 'src/common/enums/message.enum';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(@InjectRepository(CategoryEntity) private categoryRepository: Repository<CategoryEntity>) { }
  async create(createCategoryDto: CreateCategoryDto) {
    const { priority, title } = createCategoryDto;
    const category = this.categoryRepository.create({ title, priority })
    await this.categoryRepository.save(category)
    return { message: PublicMessage.Created }
  }

  findAll() {
    return `This action returns all category`;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
