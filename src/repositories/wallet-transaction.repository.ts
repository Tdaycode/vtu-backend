import { Service } from 'typedi';
import { IWalletTransactionDocument } from '../interfaces/wallet-transaction.interface';
import { AbstractRepository } from './abstract.repository';
import { WalletTransaction, PaginatedWalletTransaction } from '../models/wallet-transaction.model';

@Service()
export default class WalletTransactionRepository extends AbstractRepository<IWalletTransactionDocument> {
  constructor() {
    super(WalletTransaction);
  }

  findAllWithPagination = async (filter: any = {}, sort: any = {}, skip: number, limit: number) => {
    const options = {
      sort: sort,
      lean: true,
      leanWithId: false,
      offset: skip,
      limit: limit
    };
    return await PaginatedWalletTransaction.paginate(filter, options);
  };
}
