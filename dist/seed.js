"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_service_1 = require("./services/logger.service");
const kyc_repository_1 = __importDefault(require("./repositories/kyc.repository"));
const category_repository_1 = __importDefault(require("./repositories/category.repository"));
const product_repository_1 = __importDefault(require("./repositories/product.repository"));
const seedData_1 = require("./utils/seedData");
const database_1 = __importDefault(require("./config/database"));
const giftly_provider_1 = require("./providers/giftly.provider");
const product_interface_1 = require("./interfaces/product.interface");
const currency_repository_1 = __importDefault(require("./repositories/currency.repository"));
class Seed {
    constructor(kycRepository, currencyRepository, categoryRepository, productRepository, giftlyProvider, logger, database) {
        this.kycRepository = kycRepository;
        this.currencyRepository = currencyRepository;
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.giftlyProvider = giftlyProvider;
        this.logger = logger;
        this.database = database;
        this.initKYCLevels = async (data) => {
            try {
                for (const kyc of data) {
                    const response = await this.kycRepository.findOne({ level: kyc.level });
                    if (!response) {
                        await this.kycRepository.create(kyc);
                    }
                }
                this.logger.info("KYC seed successful");
            }
            catch (err) {
                this.logger.error("KYC seed failed");
            }
        };
        this.initCategories = async (data) => {
            try {
                for (const category of data) {
                    const response = await this.categoryRepository.findOne({ name: category.name });
                    if (!response) {
                        await this.categoryRepository.create(category);
                    }
                }
                this.logger.info("Category seed successful");
            }
            catch (err) {
                this.logger.error("Category seed failed");
            }
        };
        this.initProducts = async (data) => {
            try {
                await this.productRepository.deleteMany();
                for (const product of data) {
                    const category = await this.categoryRepository.findOne({ name: product.category });
                    if (category)
                        await this.productRepository.create({ ...product, category: category._id });
                }
                this.logger.info("Product seed successful");
            }
            catch (err) {
                this.logger.error("Product seed failed");
            }
        };
        this.initGiftCardProducts = async () => {
            try {
                const category = await this.categoryRepository.findOne({ name: "Gift Card" });
                const catalogs = await this.giftlyProvider.getCatalogs();
                for (const product of catalogs.results) {
                    const _filter = { 'providers.productId': product.sku.toString(), 'providers.name': product_interface_1.Providers.Giftly };
                    const response = await this.productRepository.findOne(_filter);
                    const currencyCode = product.currency.code === "GYD" ? "USD" : product.currency.code;
                    if (!response) {
                        const _product = {
                            name: product.title,
                            imageUrl: product.image,
                            description: product.description,
                            category: category?._id,
                            currency: currencyCode,
                            allowedPaymentOptions: [product_interface_1.PaymentTypes.Adyen, product_interface_1.PaymentTypes.Flutterwave, product_interface_1.PaymentTypes.BinancePay],
                            displayCountries: [product.regions[0].code],
                            type: product_interface_1.ProductTypes.GiftCard,
                            minPrice: product.min_price,
                            maxPrice: product.max_price,
                            label: "Email Address",
                            providers: [{
                                    name: product_interface_1.Providers.Giftly,
                                    productId: product.sku.toString(),
                                    serviceId: product_interface_1.ServiceTypes.GiftCard,
                                    active: true
                                }]
                        };
                        await this.productRepository.create(_product);
                    }
                }
                this.logger.info("Product seed successful");
            }
            catch (err) {
                console.log(err);
                this.logger.error("Product seed failed");
            }
        };
        this.initCurrency = async (data) => {
            try {
                for (const currency of data) {
                    const response = await this.currencyRepository.findOne({ code: currency.code });
                    if (!response) {
                        await this.currencyRepository.create(currency);
                    }
                }
                this.logger.info("KYC seed successful");
            }
            catch (err) {
                this.logger.error("KYC seed failed");
            }
        };
        this.seedDB = async () => {
            Promise.all([
                await this.database.initDatabase(),
                await this.initKYCLevels(seedData_1.kycLevelsData),
                await this.initCategories(seedData_1.categoriesData),
                await this.initProducts(seedData_1.productsData),
                await this.initGiftCardProducts(),
                await this.initCurrency(seedData_1.currencyData),
                await this.database.disconnectDatabase()
            ]);
        };
    }
}
const seed = new Seed(new kyc_repository_1.default(), new currency_repository_1.default(), new category_repository_1.default(), new product_repository_1.default(), new giftly_provider_1.GiftlyProvider(), new logger_service_1.LoggerClient(), new database_1.default());
seed.seedDB();
