import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { error } from 'console';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, id: number) {
    const isExist = await this.categoryRepository.findBy({
      user: {id},
      title: createCategoryDto.title
    }) 
    if (isExist.length) {
      throw new BadRequestException('this category already exist')
    }
    const category = {
      title: createCategoryDto.title,
      user: {
        id,
      }
    }
    return await this.categoryRepository.save(category)
  }

  async findAll(id: number) {
    return await this.categoryRepository.find({
      where: {
        user: { id }
      },
      relations: {
        transactions: true
      }
    });
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: {
        user: true,
        transactions: true
      }
    })
    if (!category) {
      throw new NotFoundException('this category not found')
    }
    return category
  }

 async update(id: number, updateCategoryDto: UpdateCategoryDto) {
  try {  
    await this.findCategory(id)
    await this.categoryRepository.update(id, updateCategoryDto)
    return this.categoryRepository.findOne({
      where: {id}
    })
  } catch(error) {
    throw error
  }
}
 
  async remove(id: number) {
   const category = await this.findCategory(id)
    try{
    await this.categoryRepository.remove(category)
    return category
  } catch(error) {
    throw error
  };
}

  async findCategory(id: number): Promise<Category> {
    try {
    const category = await this.categoryRepository.findOneOrFail({
      where: {id}
    });
    return category;
  } catch(error) {
    throw new BadRequestException('This category not found')
  }
  }
}
