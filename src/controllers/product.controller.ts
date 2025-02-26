import { Request } from 'express';
import { Service } from 'typedi';
import { UserService, ProductService, CategoryService } from '../services';
import { asyncWrapper } from '../utils/asyncWrapper';
import { SuccessResponse } from '../utils/SuccessResponse';

@Service()
export default class AuthController {
  constructor(
    public userService: UserService, 
    public productService: ProductService,
    public categoryService: CategoryService
  ) {}


  public getAllProducts = asyncWrapper(async (req: Request) => {
    const { country } = req.query as { country: string };
    const products = await this.categoryService.getAllProductByCategory({}, country); 
    return new SuccessResponse(products, "Products Fetched Successful");
  });

  public getProductsById = asyncWrapper(async (req: Request) => {
    const product = await this.productService.getProductByCredentials({ sid: req.params.id });
    return new SuccessResponse(product, "Product fetched Successful");
  });

  public getProductsByCategory = asyncWrapper(async (req: Request) => {
    const { country } = req.query as { country: string };
    const products = await this.categoryService.getAllProductByCategory({ sid: req.params.id }, country);
    return new SuccessResponse(products[0] ?? null, "Products fetched Fetched");
  });
  

  public getProductInfo = asyncWrapper(async (req: Request) => {
    const { receipient } = req.query as { receipient: string };
    const { id } = req.params as { id: string };
    
    const info = await this.productService.getProductInfo(id, receipient);
    return new SuccessResponse(info, "Product Info Fetched");
  });

  public searchProduct = asyncWrapper(async (req: Request) => {
    const { searchTerm, country = "NG" } = req.query as { searchTerm: string, country: string };
    const info = await this.productService.searchProduct(searchTerm, country);
    return new SuccessResponse(info, "Product Search Result Fetched");
  });

  public getProducts = asyncWrapper(async (req: Request) => {
    const { page, limit, searchTerm } = req.query as { page: string,  limit: string, searchTerm: string};
    const orders = await this.productService.getAllProducts(page, limit, searchTerm);
    return new SuccessResponse(orders, "Products Fetched Successfully");
  });

}
