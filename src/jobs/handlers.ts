import { Container } from 'typedi';
import WalletService from '../services/wallet.service';
import UserService from '../services/user.service';
import PaymentService from '../services/payment.service';
import ProductService from '../services/product.service';
import ExchangeRateService from '../services/exchange-rate.service';

const JobHandlers = {
  processKudaTransactionWebhook: async (job: { attrs: { data: any; }; }, done: () => void) => {
    const { data } = job.attrs;
    const walletService = Container.get(WalletService);
    await walletService.processKudaTransactionWebhook(data); 
    done();
  },
  processIdentityPassWebhook: async (job: { attrs: { data: any; }; }, done: () => void) => {
    const { data } = job.attrs;
    const userService = Container.get(UserService);
    await userService.verifyUserIdentity(data);
    done();
  },
  processFlutterwaveWebhook: async (job: { attrs: { data: any; }; }, done: () => void) => {
    const { data } = job.attrs;
    const pamentService = Container.get(PaymentService);
    await pamentService.completeFlutterwavePayment(data);
    done();
  },
  processBinancePayWebhook: async (job: { attrs: { data: any; }; }, done: () => void) => {
    const { data } = job.attrs;
    const pamentService = Container.get(PaymentService);
    await pamentService.completeBinancePayPayment(data);
    done();
  },
  checkGiftlyCatalogForUpdate: async (job: { attrs: { data: any; }; }, done: () => void) => {
    const { data } = job.attrs;
    const productService = Container.get(ProductService);
    await productService.checkGiftlyCatalogUpdate();
    done();
  },
  updateCurrencyExchangeRate: async (job: { attrs: { data: any; }; }, done: () => void) => {
    const { data } = job.attrs;
    const exchangeRateService = Container.get(ExchangeRateService);
    await exchangeRateService.updateCurrencyExchangeRate();
    done();
  },
  updateBinanceCurrencyExchangeRate: async (job: { attrs: { data: any; }; }, done: () => void) => {
    const { data } = job.attrs;
    const exchangeRateService = Container.get(ExchangeRateService);
    await exchangeRateService.updateBinanceCurrencyExchangeRate(data);
    done();
  },
  updateBinanceCurrencyList: async (job: { attrs: { data: any; }; }, done: () => void) => {
    const exchangeRateService = Container.get(ExchangeRateService);
    await exchangeRateService.updateBinanceList();
    done();
  },
  updateDatabaseExchangeRate: async (job: { attrs: { data: any; }; }, done: () => void) => {
    const exchangeRateService = Container.get(ExchangeRateService);
    await exchangeRateService.updateDatabaseExchangeRate();
    done();
  },
};

export default JobHandlers;