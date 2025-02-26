import { Request } from 'express';
import { Service } from 'typedi';

import UserService from '../services/user.service';
import CowryService from '../services/cowry.service';

import { asyncWrapper } from '../utils/asyncWrapper';
import { SuccessResponse } from '../utils/SuccessResponse';

@Service()
export default class CowryController {
  constructor(
    public userService: UserService, 
    public cowryService: CowryService,
  ) {}

  public checkCowryVoucher = asyncWrapper(async (req: Request) => {
    const { code } = req.params;
    const cowry = await this.cowryService.checkCowryVoucher(code); 
    return new SuccessResponse(cowry, "Cowry Voucher Fetched Successfully");
  });

  public loadCowryVoucher = asyncWrapper(async (req: Request) => {
    const { code, pin } = req.body;
    const userId = req.user._id;
    const cowry = await this.cowryService.loadCowryVoucher(code, pin, userId);
    return new SuccessResponse(cowry, "Cowry Voucher Loaded Successfully");
  });

  public transferCowry = asyncWrapper(async (req: Request) => {
    const { amount, recipient } = req.body;
    const userId = req.user._id;
    const transferData = {
      senderUserId: userId, amount,
      recipientUsername: recipient
    }
    const cowry = await this.cowryService.transferCowry(transferData);
    return new SuccessResponse(cowry, "Cowry Transfer Successful");
  });

  public getCowryTransactions = asyncWrapper(async (req: Request) => {
    const { page, limit } = req.query as { page: string,  limit: string };
    const userId = req.user._id;
    const orders = await this.cowryService.getCowryTransactions(userId, page, limit);
    return new SuccessResponse(orders, "Cowry Transactions Fetched Successfully");
  });

}
