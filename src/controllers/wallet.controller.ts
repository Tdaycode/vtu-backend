import { Request } from 'express';
import { Service } from 'typedi';
import UserService from '../services/user.service';

import { asyncWrapper } from '../utils/asyncWrapper';
import { SuccessResponse } from '../utils/SuccessResponse';
import WalletService from '../services/wallet.service';

@Service()
export default class WalletController {
  constructor(
    public userService: UserService, 
    public walletService: WalletService,
  ) {}

  public getSingleWalletTransaction = asyncWrapper(async (req: Request) => {
    const userId = req.user._id;
    const transaction = await this.walletService.getSingleWalletTransaction(userId);
    return new SuccessResponse(transaction, "Wallet Transaction Fetched Successfully");
  });

  public getWalletTransactions = asyncWrapper(async (req: Request) => {
    const { page, limit } = req.query as { page: string,  limit: string };
    const userId = req.user._id;
    const transactions = await this.walletService.getWalletTransactions(userId, page, limit);
    return new SuccessResponse(transactions, "Wallet Transactions Fetched Successfully");
  });

}
