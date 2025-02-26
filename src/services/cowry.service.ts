import { Service } from 'typedi';
import Big from 'big.js';
import { BadRequestError } from '../utils/ApiError';
import countryToCurrency from 'country-to-currency'
import { CowryTransferData, ICowryDocument } from '../interfaces/cowry.interface';
import { generateCowryVoucherCode, generateShortID } from '../utils/helpers';
import Cowry from '../models/cowry.model';
import { CowryTransactionRepository, CowryRepository, UserRepository } from '../repositories';
import { TransactionStatus, Transactiontype } from '../interfaces/cowry-transaction.interface';
import runInTransaction from '../utils/runInTransaction.util';
import { LoggerClient } from './logger.service';
import CurrencyService from './currency.service';

@Service()
export default class CowryService {
  constructor(
    public logger: LoggerClient,
    public currencyService: CurrencyService,
    public userRepository: UserRepository,
    public cowryRepository: CowryRepository,
    public cowryTransactionRepository: CowryTransactionRepository,
  ) { }

  public getCowryProductInfo = async (data: any) => {
    const { type, productName, provider, product_id, country, productCurrency } = data;
    const currency = countryToCurrency[country];
    if (!currency) throw new BadRequestError("Invalid Country Code")
    const baseCurrency = "USD";

    const pricebaseCurrency = await this.currencyService.convertLocalCurrency(product_id, productCurrency, baseCurrency);
    let price = pricebaseCurrency;

    if (currency !== baseCurrency) {
      const convertFunction = currency === "NGN" ? "convertNGNCurrency" : "convertCurrency";
      price = await this.currencyService[convertFunction](parseFloat(pricebaseCurrency), baseCurrency, currency);
    }

    return {
      type, provider,
      products: [
        {
          currency: currency,
          amount: price,
          hasOpenRange: false,
          name: productName,
          product_id: `${country}-${product_id}`
        }
      ]
    }

  };

  public creditCowry = async (userId: string, amount: number) => {
    const update = { $inc: { cowryBalance: amount } };
    const user = await this.userRepository.updateUser({ _id: userId }, update);
    if (!user) throw new BadRequestError("Unable to Credit Cowry")
  };

  public static createCowryVoucher = async (value: number) => {
    const code = generateCowryVoucherCode();
    const pin = generateShortID();
    const cowry = new Cowry({ value, code, pin });
    await cowry.save();
    return { code, pin };
  };

  public checkCowryVoucher = async (code: string) => {
    const cowry = await this.cowryRepository.findOne({ code });
    const cowryInfo: Partial<ICowryDocument> = cowry.toObject();
    delete cowryInfo['pin'];

    return cowryInfo;
  };

  public loadCowryVoucher = async (code: string, pin: string, userId: string) => {
    const cowry = await this.cowryRepository.findOne({ code, isValid: true });
    if (!(await cowry.isPinMatch(pin))) throw new BadRequestError('Invalid Code or Pin');
    await this.creditCowry(userId, cowry.value);
    await this.cowryRepository.updateOne({ code }, { isValid: false });
    await this.recordCowryTransaction(userId, Transactiontype.Credit, TransactionStatus.Successful, cowry.value)
    return cowry;
  };

  public recordCowryTransaction = async (userId: string, type: Transactiontype, status: TransactionStatus, 
    amount: number, sender = "GiftCop") => {
    const transaction = await this.cowryTransactionRepository.create(userId, type, amount, status, sender);
    return transaction;
  };

  public transferCowry = async (transferData: CowryTransferData) => {
    await runInTransaction(async (session: any) => {
      const sourceUser = await this.userRepository.findUser({ _id: transferData.senderUserId });
      const destinationUser = await this.userRepository.findUser({ userName: transferData.recipientUsername });
      if (!sourceUser || !destinationUser) throw new BadRequestError('User not found.');
      
      // Check sender balance
      const balance = (Big(sourceUser.cowryBalance).minus(transferData.amount)).toFixed(2)
 
      // Check if the sender has enough balance to make the transfer.
      if(Big(balance).lt(0)) throw new BadRequestError('Insufficient balance.');

      const sourceUserUpdate = { $inc: { cowryBalance: -1 * transferData.amount } };
      const destinationUserUpdate = { $inc: { cowryBalance: transferData.amount } };
      const description = "Cowry Transfer"
      
      // Debit Sender
      await this.userRepository.updateUser({ _id: transferData.senderUserId }, sourceUserUpdate, session);
      await this.cowryTransactionRepository.create(sourceUser._id, Transactiontype.Debit, transferData.amount,
         TransactionStatus.Successful, sourceUser.userName, description, session);

      // Credit Recipient
      await this.userRepository.updateUser({ userName: transferData.recipientUsername }, destinationUserUpdate, session);
      await this.cowryTransactionRepository.create(destinationUser._id, Transactiontype.Credit, transferData.amount, 
        TransactionStatus.Successful, sourceUser.userName, description, session);    
     
    });
  };

  public debitCowry = async (amount: number, userId: string) => {
    await runInTransaction(async (session: any) => {
      const user = await this.userRepository.findUser({ _id: userId });
      if (!user) throw new BadRequestError('User not found.');
      
      // Check sender balance
      const balance = (Big(user.cowryBalance).minus(amount)).toFixed(2)
 
      // Check if the sender has enough balance to make the transfer.
      if(Big(balance).lt(0)) throw new BadRequestError('Insufficient balance.');

      const userUpdate = { $inc: { cowryBalance: -1 * amount } };
      const description = "Cowry Payment"
      
      // Debit Sender
      await this.userRepository.updateUser({ _id: userId }, userUpdate, session);
      await this.cowryTransactionRepository.create(user._id, Transactiontype.Debit, amount,
         TransactionStatus.Successful, user.userName, description, session);
    });
  };

  getCowryTransactions = async (userId: string, page: string, limit: string) => {
    const _page = parseInt(page) ? parseInt(page) : 1;
    const _limit = parseInt(limit) ? parseInt(limit) : 10;
    const skip: number = (_page - 1) * _limit;
    const filter = { userId }, sort = { createdAt: -1 };
    return await this.cowryTransactionRepository.findAllWithPagination(filter, sort, skip, _limit);
  };
}
