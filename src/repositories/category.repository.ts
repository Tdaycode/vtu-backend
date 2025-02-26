import Category from '../models/category.model';
import { Service } from 'typedi';
import { ICategoryDocument, ICategory } from '../interfaces/category.interface';

@Service()
export default class CategoryRepository {
  create = async (data: ICategory): Promise<ICategoryDocument> => {
    const category = new Category(data);
    return await category.save();
  };

  findAll = async (filter: any = {}): Promise<ICategoryDocument[]> => {
    return await Category.find(filter);
  };

  getAllProductByCategory = async (filter = {}, country = "NG"): Promise<ICategoryDocument[]> => {
    const _filter = {
      $or: [
        { displayCountries: "GLC" },
        { displayCountries: { $in: [country] } } 
      ]
    };

    const query = [
      { "$match": filter },
      {
          $lookup: {
              from: "products",
              localField: '_id',
              foreignField: 'category',
              as: "products",
              pipeline: [
                { "$match": _filter },
                { $project: { name: 1, imageUrl: 1, type: 1, sid: 1, category: 1 } },
              ],
          }
      }
    ];
    return await Category.aggregate(query);
  };

  findById = async (id: string): Promise<ICategoryDocument | null> => {
    return await Category.findOne({ _id: id });
  };


  findOne = async (filter: any): Promise<ICategoryDocument | null> => {
    return await Category.findOne(filter);
  };

  updateOne = async (filter: any, data: any): Promise<ICategoryDocument | null> => {
    const response = await Category.findOneAndUpdate(filter, data, { new: true });
    return response;
  };
}
