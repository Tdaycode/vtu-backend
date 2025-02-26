import { LoggerClient } from './services/logger.service';
import KYCRepository from './repositories/kyc.repository';
import CategoryRepository from './repositories/category.repository';
import ProductRepository from './repositories/product.repository';
import { adminData, categoriesData, currencyData, kycLevelsData, paymentMethodsData, productsData, settingsData } from './utils/seedData';
import Database from './config/database';
import { IKYCLevel } from './interfaces/kyc.interface';
import { ICategory } from './interfaces/category.interface';
import { GiftlyProvider } from './providers/giftly.provider';
import { ValueTopupProvider } from './providers/valuetopup.provider';
import { PaymentTypes, ProductTypes, Providers, ServiceTypes } from './interfaces/product.interface';
import CurrencyRepository from './repositories/currency.repository';
import SettingsRepository from './repositories/settings.repository';
import { ISettings } from './interfaces/settings.interface';
import UserRepository from './repositories/user.repository';
import { IAdminUser } from './interfaces/user.interface';
import { PaymentMethodRepository } from './repositories';
import { IPaymentMethod } from './interfaces/payment.interface';

class Seed {
  constructor(
    public kycRepository: KYCRepository,
    public currencyRepository: CurrencyRepository,
    public categoryRepository: CategoryRepository,
    public productRepository: ProductRepository,
    public settingsRepository: SettingsRepository,
    public userRepository: UserRepository,
    public giftlyProvider: GiftlyProvider,
    public logger: LoggerClient,
    public database: Database,
    public valueTopupProvider: ValueTopupProvider,
    public paymentMethodRepository: PaymentMethodRepository,
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
      // await this.productRepository.deleteMany();
      for (const product of data) {
        const category = await this.categoryRepository.findOne({ name: product.category });
        if (category) await this.productRepository.create({ ...product, category: category._id });
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
            allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.BinancePay, PaymentTypes.Cowry, PaymentTypes.Wallet],
            displayCountries: ["GLC", product.regions[0].code],
            type: ProductTypes.GiftCard,
            minPrice: product.min_price,
            maxPrice: product.max_price,
            label: "Email Address",
            providers: [{
              name: Providers.Giftly,
              productId: product.sku.toString(),
              serviceId: ServiceTypes.GiftCard,
              active: true
            }]
          };
          try {
            await this.productRepository.create(_product)
          } catch (error) {
            console.log(error)
          }
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
      this.logger.info("Currency seed successful");
    } catch (err) {
      this.logger.error("Currency seed failed");
    }
  };

  private initSettings = async (data: ISettings[]) => {
    try {
      for (const item of data) {
        const response = await this.settingsRepository.findSingle({ type: item.type });
        if (!response) await this.settingsRepository.create(item);
      }
      this.logger.info("Settings seed successful");
    } catch (err) {
      this.logger.error("Settings seed failed");
    }
  };

  private initAdmin = async (data: IAdminUser[]) => {
    try {
      for (const admin of data) {
        const response = await this.userRepository.findUser({ email: admin.email });
        if (!response) await this.userRepository.createUser(admin);
      }
      this.logger.info("Admin seed successful");
    } catch (err) {
      this.logger.error("Admin seed failed");
    }
  };

  private initValueTopupProducts = async () => {
    try {
      const airtimeCategory = await this.categoryRepository.findOne({ name: "Airtime" });
      const giftCardCategory = await this.categoryRepository.findOne({ name: "Gift Card" });

      const catalogs = await this.valueTopupProvider.getCatalog();
      for (const product of catalogs.payLoad) {
        const _filter = { 'providers.productId': product.skuId.toString(), 'providers.name': Providers.ValueTopup };
        const response = await this.productRepository.findOne(_filter);
        if(product.countryCode === "NG") continue;
        if (!response) {
          let _product = {
            name: product.productName,
            imageUrl: product.imageUrl,
            description: product?.productDescription ?? "",
            category: airtimeCategory?._id,
            currency: product.min.faceValueCurrency ?? product.min.deliveryCurrencyCode,
            allowedPaymentOptions: [PaymentTypes.BinancePay, PaymentTypes.Cowry, PaymentTypes.Adyen],
            displayCountries: [product.countryCode],
            type: ProductTypes.Airtime,
            minPrice: product.min.faceValue,
            maxPrice: product.max.faceValue,
            label: "Phone Number",
            providers: [{
              name: Providers.ValueTopup,
              productId: product.skuId.toString(),
              serviceId: ServiceTypes.Internet,
              active: true
            }]
          };

          if (product.category === "GiftCard") {
            _product = {
              ..._product,
              category: giftCardCategory?._id,
              label: "Email Address",
              type: ProductTypes.GiftCard,
              allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.BinancePay, PaymentTypes.Cowry, PaymentTypes.Wallet],
              displayCountries: ["GLC", product.countryCode],
              providers: [{
                name: Providers.ValueTopup,
                productId: product.skuId.toString(),
                serviceId: ServiceTypes.GiftCard,
                active: true
              }],
            }
          }
          try {
            await this.productRepository.create(_product)
          } catch (error) {
            console.log(error)
          }
        }
      }
      this.logger.info("Product seed successful");
    } catch (err) {
      console.log(err)
      this.logger.error("Product seed failed");
    }
  };

  private initPaymentMethods = async (data: IPaymentMethod[]) => {
    try {
      for (const item of data) {
        const response = await this.paymentMethodRepository.findSingle({ type: item.type });
        if (!response) await this.paymentMethodRepository.create(item);
      }
      this.logger.info("Payment Method seed successful");
    } catch (err) {
      this.logger.error("Payment Method seed failed");
    }
  };

  public seedDB = async () => {
    Promise.all([
      await this.database.initDatabase(),
      // await this.initKYCLevels(kycLevelsData),
      // await this.initCategories(categoriesData),
      // await this.initProducts(productsData),
      // await this.initGiftCardProducts(),
      // await this.initCurrency(currencyData),
      // await this.initSettings(settingsData),
      // await this.initAdmin(adminData),
      // await this.initValueTopupProducts(),
      // await this.initPaymentMethods(paymentMethodsData),
      await this.database.disconnectDatabase()
    ])
  }
}

const seed = new Seed(new KYCRepository(), new CurrencyRepository(), new CategoryRepository(), new ProductRepository(), new SettingsRepository(), 
  new UserRepository(), new GiftlyProvider(), new LoggerClient(), new Database(), new ValueTopupProvider(), new PaymentMethodRepository());
seed.seedDB();
