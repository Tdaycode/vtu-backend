import { Request } from 'express';
import { Service } from 'typedi';
import { CategoryService } from '../services';
import { asyncWrapper } from '../utils/asyncWrapper';
import { SuccessResponse } from '../utils/SuccessResponse';

@Service()
export default class CategoryController {
  constructor(
    public categoryService: CategoryService
  ) {}

  public getAllCategories = asyncWrapper(async (req: Request) => {
    const products = await this.categoryService.getAllCategories(); 
    return new SuccessResponse(products, "Categories Fetched Successfully");
  });

  public getCategoriesById = asyncWrapper(async (req: Request) => {
    const products = await this.categoryService.getCategoryByCredentials({ _id: req.params.id }); 
    return new SuccessResponse(products, "Category Fetched Successfully");
  });

  public updateCategoryById = asyncWrapper(async (req: Request) => {
    const { id } = req.params;
    const product = await this.categoryService.editCategory({ _id: id }, req.body);
    return new SuccessResponse(product, "Category updated Successfully");
  });

}
