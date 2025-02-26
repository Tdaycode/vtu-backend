import { FilterQuery } from 'mongoose';
import { Service } from 'typedi';
import { ICowryTransactionDocument, TransactionStatus, Transactiontype } from '../interfaces/cowry-transaction.interface';
import { CowryTransaction, PaginatedCowryTransaction } from '../models/cowry-transaction';
import { BadRequestError } from '../utils/ApiError';

@Service()
export default class CowryTransactionRepository {
  create = async (
    userId: string, type: Transactiontype, amount: number, status: TransactionStatus,
    sender: string, description = "Cowry Transfer", session = null
  ): Promise<ICowryTransactionDocument> => {
    const sessionOption = session ? { session } : {};
    const document = new CowryTransaction({ type, userId, amount, sender, description, status });
    return await document.save(sessionOption);
  };

  findAll = async (): Promise<ICowryTransactionDocument[]> => {
    return await CowryTransaction.find();
  };

  findById = async (id: string): Promise<ICowryTransactionDocument | null> => {
    return await CowryTransaction.findOne({ _id: id });
  };

  findOne = async (filter: FilterQuery<ICowryTransactionDocument>): Promise<ICowryTransactionDocument> => {
    const result = await CowryTransaction.findOne(filter);
    if (!result) throw new BadRequestError('Cowry Transaction with the given credential does not exist.');
    return result;
  };

  updateOne = async (filter: FilterQuery<ICowryTransactionDocument>, data: any): Promise<ICowryTransactionDocument | null> => {
    const response = await CowryTransaction.findOneAndUpdate(filter, data, { new: true });
    return response;
  };

  findAllWithPagination = async (filter: FilterQuery<ICowryTransactionDocument> = {}, sort: any = {}, skip: number, limit: number) => {
    const options = {
      sort: sort,
      lean: true,
      leanWithId: false,
      offset: skip,
      limit: limit
    };
    return await PaginatedCowryTransaction.paginate(filter, options);
  };
}
