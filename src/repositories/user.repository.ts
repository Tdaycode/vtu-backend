import { User, PaginatedUser } from '../models/user.model';
import { IUserDocument } from '../interfaces/user.interface';
import { Service } from 'typedi';

@Service()
export default class UserRepository {
  createUser = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    phoneNumber: string,
    country: string,
  ): Promise<IUserDocument> => {
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      country,
    });
    return await user.save();
  };

  findByEmail = async (email: string): Promise<IUserDocument | null> => {
    return await User.findOne({ email });
  };

  findUser = async (filter: any): Promise<IUserDocument | null> => {
    return await User.findOne(filter);
  };

  updateUser = async (filter: any, data: any, session = null): Promise<IUserDocument | null> => {
    const sessionOption = session ? { session } : {};
    const response = await User.findOneAndUpdate(filter, data, { new: true, ...sessionOption });
    return response;
  };

  getAllUsers = async (): Promise<IUserDocument[]> => {
    return await User.find();
  };

  getUser = async (filter: any): Promise<IUserDocument| null> => {
    return await User.findOne(filter);
  };

  getUserProfile = async (id: string): Promise<IUserDocument| null> => {
    return await User.findOne({ _id: id}).select("-password -twoFA -__v")
      .populate({ path: 'kycLevel', select: '-_id level dailyLimit monthlyLimit baseCurrency' });
  };

  findAllWithPagination = async (filter: any = {}, sort: any = {}, skip: number, limit: number) => {
    const options = {
      sort: sort,
      lean: true,
      leanWithId: false,
      offset: skip,
      limit: limit
    };
    return await PaginatedUser.paginate(filter, options);
  };
}
