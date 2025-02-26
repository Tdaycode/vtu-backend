import { Service } from 'typedi';
import Big from 'big.js';
import { BadRequestError } from '../utils/ApiError';
import { WalletTransactionRepository, UserRepository } from '../repositories';
import { TransactionStatus, Transactiontype } from '../interfaces/wallet-transaction.interface';
import runInTransaction from '../utils/runInTransaction.util';
import { LoggerClient } from './logger.service';
import CurrencyService from './currency.service';
import { TransactionWebhook, TransactionWebhookType } from '../interfaces/responses/kuda.response.interface';
import { KudaProvider } from '../providers/kuda.provider';
import { IUserDocument } from '../interfaces/user.interface';

@Service()
export default class WalletService {
  constructor(
    public logger: LoggerClient,
    public currencyService: CurrencyService,
    public userRepository: UserRepository,
    public kudaProvider: KudaProvider,
    public walletTransactionRepository: WalletTransactionRepository,
  ) { }

  public creditWallet = async (userId: string, amount: number, reference: string, description = "Wallet Transaction") => {
    await runInTransaction(async (session: any) => {
      const user = await this.userRepository.findUser({ _id: userId });
      if (!user) throw new BadRequestError('User not found.');

      const update = { $inc: { mainBalance: amount } };
      const newUser = await this.userRepository.updateUser({ _id: userId }, update, session);
      if (!newUser) throw new BadRequestError("Unable to Credit Wallet");
     
      return await this.recordWalletTransaction(user._id, reference, Transactiontype.Credit, TransactionStatus.Successful, 
        amount, description, user.mainBalance, newUser?.mainBalance, session);
    });
  };

  public recordWalletTransaction = async (
    userId: string,
    reference: string,
    type: Transactiontype,
    status: TransactionStatus,
    amount: number,
    description: string,
    openingBalance: number,
    balanceAfter: number,
    session = null
  ) => {
    const data = { userId, reference, type, amount, status, description, openingBalance, balanceAfter };
    return await this.walletTransactionRepository.create(data, session);
  };

  public debitWallet = async (userId: string, amount: number, reference: string, description = "Wallet Transaction") => {
    await runInTransaction(async (session: any) => {
      const user = await this.userRepository.findUser({ _id: userId }); 

      if (!user) throw new BadRequestError('User not found.');

      // Check sender balance
      const balance = (Big(user.mainBalance).minus(amount)).toFixed(2)

      // Check if the sender has enough balance to make the transfer.
      if (Big(balance).lt(0)) throw new BadRequestError('Insufficient balance.');
      const userUpdate = { $inc: { mainBalance: -1 * amount } };

      // Debit Sender
      const newUser = await this.userRepository.updateUser({ _id: userId }, userUpdate, session);
      if (!newUser) throw new BadRequestError("Unable to Debit Wallet");

      return await this.recordWalletTransaction(user._id, reference, Transactiontype.Debit,
        TransactionStatus.Successful, amount, description, user.mainBalance, newUser.mainBalance, session);
    });
  };

  public getWalletTransactions = async (userId: string, page: string, limit: string) => {
    const _page = parseInt(page) ? parseInt(page) : 1;
    const _limit = parseInt(limit) ? parseInt(limit) : 10;
    const skip: number = (_page - 1) * _limit;
    const filter = { userId }, sort = { createdAt: -1 };
    return await this.walletTransactionRepository.findAllWithPagination(filter, sort, skip, _limit);
  };

  public processKudaTransactionWebhook = async (data: TransactionWebhook) => {
    const user = await this.userRepository.findUser({ "bankInfo.accountNumber": data.accountNumber });
    if (!user) return;

    const tx = await this.walletTransactionRepository.findSingle({ reference: data.clientRequestRef });
    if (tx) return;

    if(data.transactionType === TransactionWebhookType.Debit) return;

    return await this.creditWallet(user?._id.toString(), data.amount, data.clientRequestRef);
  };

  public getSingleWalletTransaction = async (userId: string) => {
    const filter = { userId };
    return await this.walletTransactionRepository.findOne(filter);
  };

  public generateBankAccountDetails = async (user: IUserDocument) => {
    const accountDetails = await this.kudaProvider.createStaticVirtualAccount(user);
    return accountDetails;
  };
}
