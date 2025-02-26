import { LoggerClient } from './services/logger.service';
import KYCRepository from './repositories/kyc.repository';
import CategoryRepository from './repositories/category.repository';
import ProductRepository from './repositories/product.repository';
import { categoriesData, currencyData, kycLevelsData, productsData } from './utils/seedData';
import Database from './config/database';
import { IKYCLevel } from './interfaces/kyc.interface';
import { ICategory } from './interfaces/category.interface';
import { GiftlyProvider } from './providers/giftly.provider';
import { PaymentTypes, ProductTypes, Providers, ServiceTypes } from './interfaces/product.interface';
import { ICurrency } from './interfaces/currency.interface';
import CurrencyRepository from './repositories/currency.repository';

class Seed {
  constructor(
    public kycRepository: KYCRepository,
    public currencyRepository: CurrencyRepository,
    public categoryRepository: CategoryRepository,
    public productRepository: ProductRepository,
    public giftlyProvider: GiftlyProvider,
    public logger: LoggerClient,
    public database: Database,
  ) { }

  private initKYCLevels = async (data: IKYCLevel[]) => {
    try {
      for (const kyc of data) {
        const response = await this.kycRepository.findOne({ level: kyc.level });
        if (!response) {
          await this.kycRepository.create(kyc)
        }
      }
      this.logger.info("KYC seed successful");
    } catch (err) {
      this.logger.error("KYC seed failed");
    }
  };

  private initCategories = async (data: ICategory[]) => {
    try {
      for (const category of data) {
        const response = await this.categoryRepository.findOne({ name: category.name });
        if (!response) {
          await this.categoryRepository.create(category)
        }
      }
      this.logger.info("Category seed successful");
    } catch (err) {
      this.logger.error("Category seed failed");
    }
  };

  private initProducts = async (data: any) => {
    try {
      await this.productRepository.deleteMany();
      for (const product of data) {
        const category = await this.categoryRepository.findOne({ name: product.category });
        if(category) await this.productRepository.create({ ...product, category: category._id });
      }
      this.logger.info("Product seed successful");
    } catch (err) {
      this.logger.error("Product seed failed");
    }
  };

  private initGiftCardProducts = async () => {
    try {
      const category = await this.categoryRepository.findOne({ name: "Gift Card" });
      const catalogs = await this.giftlyProvider.getCatalogs();
      
      for (const product of catalogs.results) {
        const _filter = { 'providers.productId': product.sku.toString(), 'providers.name': Providers.Giftly };
        const response = await this.productRepository.findOne(_filter);
        const currencyCode = product.currency.code === "GYD" ? "USD" : product.currency.code;
        if (!response) {
          const _product = {
            name: product.title,
            imageUrl: product.image,
            description: product.description,
            category: category?._id,
            currency: currencyCode,
            allowedPaymentOptions: [PaymentTypes.Adyen, PaymentTypes.Flutterwave, PaymentTypes.BinancePay],
            displayCountries: [product.regions[0].code],
            type: ProductTypes.GiftCard,
            minPrice: product.min_price,
            maxPrice: product.max_price,
            label: "Email Address",
            providers:[{
                name: Providers.Giftly,
                productId: product.sku.toString(),
                serviceId: ServiceTypes.GiftCard,
                active: true
            }]
          };
          await this.productRepository.create(_product)
        }
      }
      this.logger.info("Product seed successful");
    } catch (err) {
      console.log(err)
      this.logger.error("Product seed failed");
    }
  };

  private initCurrency = async (data: any[]) => {
    try {
      for (const currency of data) {
        const response = await this.currencyRepository.findOne({ code: currency.code });
        if (!response) {
          await this.currencyRepository.create(currency)
        }
      }
      this.logger.info("KYC seed successful");
    } catch (err) {
      this.logger.error("KYC seed failed");
    }
  };


  public seedDB = async () => {
    Promise.all([
      await this.database.initDatabase(),
      await this.initKYCLevels(kycLevelsData),
      await this.initCategories(categoriesData),
      await this.initProducts(productsData),
      await this.initGiftCardProducts(),
      await this.initCurrency(currencyData),
      await this.database.disconnectDatabase() 
    ])
  }
}

const seed = new Seed(new KYCRepository(), new CurrencyRepository(), new CategoryRepository(), 
  new ProductRepository(), new GiftlyProvider(), new LoggerClient(), new Database());
seed.seedDB();
