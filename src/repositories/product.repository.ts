import { Product, PaginatedProduct } from '../models/product.model';
import { Service } from 'typedi';
import { IProductDocument, IProduct } from '../interfaces/product.interface';

@Service()
export default class ProductRepository {
  create = async (data: Partial<IProduct>): Promise<IProductDocument> => {
    const product = new Product(data);
    return await product.save();
  };

  findAll = async (filter: any = {}): Promise<IProductDocument[]> => {
    return await Product.find(filter).lean();
  };

  search = async (searchString: string, country: string): Promise<IProductDocument[]> => {
    const regexQuery = new RegExp(searchString, 'i');
   const query = {
      name: { $regex: regexQuery },
      $or: [
        { displayCountries: "GLC" },
        { displayCountries: { $in: [country] } } 
      ]
    };
    return await Product.find(query)
      .select("name imageUrl type category sid").lean();
  };

  findById = async (id: string): Promise<IProductDocument | null> => {
    return await Product.findOne({ _id: id });
  };


  findOne = async (filter: any): Promise<IProductDocument | null> => {
    return await Product.findOne(filter);
  };

  updateOne = async (filter: any, data: any): Promise<IProductDocument | null> => {
    const response = await Product.findOneAndUpdate(filter, data, { new: true });
    return response;
  };

  deleteMany = async (filter: any = {}): Promise<void> => {
    await Product.deleteMany(filter);
  };

  findAllWithPagination = async (filter: any = {}, sort: any = {}, skip: number, limit: number) => {
    const options = {
      sort: sort,
      lean: true,
      leanWithId: false,
      offset: skip,
      limit: limit
    };
    return await PaginatedProduct.paginate(filter, options);
  };
}
