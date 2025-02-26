import Category from '../models/category.model';
import { Service } from 'typedi';
import { ICategoryDocument, ICategory } from '../interfaces/category.interface';
import { SettingsType } from '../interfaces/settings.interface';
import { DiscountAmountType, DiscountType } from '../interfaces/product.interface';

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
      ],
      isAvailable: true
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
            {
              $lookup: {
                from: "settings",
                as: "settings",
                pipeline: [
                  { "$match": { type: SettingsType.globalDiscount, active: true } }
                ]
              }
            },
            {
              $addFields: {
                globalDiscount: { $arrayElemAt: ["$settings", 0] },
              }
            },
            { 
              $project: { 
                name: 1, imageUrl: 1, type: 1, sid: 1, category: 1,
                discount: {
                  $cond: {
                    if: {
                      $or: [
                        { $eq: [ true, "$discount.active" ] },
                        { $eq: [ true, "$globalDiscount.active" ] },
                      ]
                    }, 
                    then: {
                      type: {
                        $cond: {
                          if: {
                            $eq: [ DiscountType.Global, "$discount.type" ]
                          }, 
                          then: DiscountAmountType.Percentage, 
                          else: "$discount.mode"
                        }
                      },
                      value: {
                        $cond: {
                          if: {
                            $and: [
                              { $eq: [ true, "$discount.active" ] },
                              { $eq: [ DiscountType.Specific, "$discount.type" ] },
                            ]
                          }, then: "$discount.value", else: "$globalDiscount.value"
                        }
                      }
                    }, 
                    else: null
                  }
                }
              } 
            },
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
