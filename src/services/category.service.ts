import { Service } from 'typedi';
import CategoryRepository from '../repositories/category.repository';
import { LoggerClient } from './logger.service';
import { BadRequestError } from '../utils/ApiError';
import { ICategory } from '../interfaces/category.interface';

@Service()
export default class CategoryService {
  constructor(
    public logger: LoggerClient,
    public categoryRepository: CategoryRepository,
  ) { }




  createCategory = async (data: ICategory) => {
    return await this.categoryRepository.create(data);
  };

  getAllCategories = async () => {
    return await this.categoryRepository.findAll();
  };

  getCategoriesByCredentials = async (data: any) => {
    return await this.categoryRepository.findAll(data);
  };

  getAllProductByCategory = async (data: any, country: string) => {
    return await this.categoryRepository.getAllProductByCategory(data, country);
  };

  getCategoryByCredentials = async (data: any) => {
    const response = await this.categoryRepository.findOne(data);
    if (!response) throw new BadRequestError('Category with the given credential does not exist.');
    return response;
  };
}
