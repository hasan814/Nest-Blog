import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ConflictMessage, NotFoundMessage, PublicMessage } from 'src/common/enums/message.enum';
import { paginationGenerator, paginationSolver } from 'src/common/utils/pagination.utils';
import { CreateCategoryDto } from './dto/create-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Repository } from 'typeorm';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(@InjectRepository(CategoryEntity) private categoryRepository: Repository<CategoryEntity>) { }

  async create(createCategoryDto: CreateCategoryDto) {
    let { priority, title } = createCategoryDto;
    title = await this.checkExistAndResolveTitle(title)
    const category = this.categoryRepository.create({ title, priority })
    await this.categoryRepository.save(category)
    return { message: PublicMessage.Created }
  }

  async checkExistAndResolveTitle(title: string) {
    title = title?.trim()?.toLowerCase()
    const category = await this.categoryRepository.findOneBy({ title })
    if (category) throw new ConflictException(ConflictMessage.categoryTitle)
    return title
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, page, skip } = paginationSolver(paginationDto)
    const [categories, count] = await this.categoryRepository.findAndCount({ where: {}, skip, take: limit })
    return { pagination: paginationGenerator(count, page, limit), categories }
  }
  async findOne(id: number) {
    const category = await this.categoryRepository.findOneBy({ id })
    if (!category) throw new NotFoundException(NotFoundMessage.NotFoundCategory)
    return category
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id)
    const { priority, title } = updateCategoryDto
    if (title) category.title = title
    if (priority) category.priority = priority
    await this.categoryRepository.save(category)
    return { message: PublicMessage.Updated }
  }

  async remove(id: number) {
    await this.findOne(id)
    await this.categoryRepository.delete({ id })
    return { message: PublicMessage.Deleted }
  }
}
