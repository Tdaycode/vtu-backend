"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const big_js_1 = __importDefault(require("big.js"));
const moment_1 = __importDefault(require("moment"));
const country_to_currency_1 = __importDefault(require("country-to-currency"));
const repositories_1 = require("../repositories");
const currency_service_1 = __importDefault(require("../services/currency.service"));
const user_service_1 = __importDefault(require("../services/user.service"));
const notification_service_1 = __importDefault(require("../services/notification.service"));
const cowry_service_1 = __importDefault(require("../services/cowry.service"));
const logger_service_1 = require("../services/logger.service");
const ApiError_1 = require("../utils/ApiError");
const order_interface_1 = require("../interfaces/order.interface");
const providers_1 = require("../providers");
const product_interface_1 = require("../interfaces/product.interface");
const helpers_1 = require("../utils/helpers");
const factories_1 = require("./factories");
const transformers_1 = require("./transformers");
let OrderService = class OrderService {
    constructor(logger, orderRepository, productRepository, primeAirtimeProvider, currencyService, cowryService, userService, notificationService) {
        this.logger = logger;
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.primeAirtimeProvider = primeAirtimeProvider;
        this.currencyService = currencyService;
        this.cowryService = cowryService;
        this.userService = userService;
        this.notificationService = notificationService;
        this.createOrder = async (orderRequest) => {
            const product = await this.productRepository.findOne({ _id: orderRequest.productID });
            if (!product)
                throw new ApiError_1.NotFoundError("Product Not Found");
            if (!product.allowedPaymentOptions?.includes(orderRequest.paymentMethod))
                throw new ApiError_1.BadRequestError("Unsupported Payment Method");
            if (!product.displayCountries?.includes("GLC") && !product.displayCountries?.includes(orderRequest.country))
                throw new ApiError_1.BadRequestError("Product Unavailable in your Country");
            const order = await this.createOrderSummary(orderRequest, product);
            const orderNumber = (0, helpers_1.generateOrderNumber)();
            let amountUSD = order.amount;
            if (order.currency !== "USD") {
                const convertFunction = order.currency === "NGN" ? "convertLocalCurrency" : "convertCurrency";
                const amount = await this.currencyService[convertFunction](order.amount, order.currency, "USD");
                amountUSD = Number(amount);
            }
            return await this.orderRepository.create({ ...order, orderNumber, userId: orderRequest.userId, amountUSD });
        };
        this.createOrderSummary = async (orderRequest, product) => {
            let provider, rawInfo = {}, validationResult;
            let serviceFee = 0;
            const { productID, product_id, amount, recipient, country, electricityType } = orderRequest;
            const providers = product.providers?.filter(item => item.active === true);
            if (!providers || providers.length === 0)
                throw new ApiError_1.BadRequestError("Provider Not available");
            const currentProvider = providers[0].name;
            const serviceId = providers[0].serviceId;
            const productType = product.type;
            let productCurrency = product.currency;
            let productAmount = amount;
            // Validation
            if (product.type === product_interface_1.ProductTypes.Electricity && !electricityType)
                throw new ApiError_1.BadRequestError("electricityType required");
            const prepaid = electricityType === product_interface_1.ElectricityType.PREPAID ? true : false;
            const rawData = {
                type: productType, validate: true,
                provider: currentProvider, product_id,
                amount, electricityType
            };
            switch (productType) {
                case product_interface_1.ProductTypes.Airtime:
                    provider = factories_1.AirtimeProviderFactory.getProvider(currentProvider);
                    rawInfo = await provider.getAirtimeTopUpInfo(recipient);
                    validationResult = transformers_1.AirtimeTransformer.validate({ ...rawInfo, ...rawData }, currentProvider);
                    break;
                case product_interface_1.ProductTypes.Data:
                    provider = factories_1.DataProviderFactory.getProvider(currentProvider);
                    rawInfo = await provider.getDataTopUpInfo(recipient);
                    validationResult = transformers_1.DataTransformer.validate({ ...rawInfo, ...rawData }, currentProvider);
                    break;
                case product_interface_1.ProductTypes.Betting:
                    provider = factories_1.BettingProviderFactory.getProvider(currentProvider);
                    rawInfo = await provider.getBettingInfo(recipient, productType, serviceId, product_id);
                    validationResult = transformers_1.BettingTransformer.validate({ ...rawInfo, ...rawData }, currentProvider);
                    break;
                case product_interface_1.ProductTypes.Electricity:
                    provider = factories_1.ElectricityProviderFactory.getProvider(currentProvider);
                    rawInfo = await provider.getElectricityInfo(recipient, productType, serviceId, product_id);
                    validationResult = transformers_1.ElectricityTransformer.validate({ ...rawInfo, ...rawData }, currentProvider);
                    break;
                case product_interface_1.ProductTypes.TV:
                    provider = factories_1.TVProviderFactory.getProvider(currentProvider);
                    const productId = providers[0].productId;
                    rawInfo = await provider.getTVInfo(recipient, productType, serviceId, productId);
                    validationResult = transformers_1.TVTransformer.validate({ ...rawInfo, ...rawData }, currentProvider);
                    break;
                case product_interface_1.ProductTypes.Internet:
                    provider = factories_1.InternetProviderFactory.getProvider(currentProvider);
                    const productId2 = providers[0].productId;
                    rawInfo = await provider.getInternetInfo(recipient, productType, serviceId, productId2);
                    validationResult = transformers_1.InternetTransformer.validate({ ...rawInfo, ...rawData }, currentProvider);
                    break;
                case product_interface_1.ProductTypes.GiftCard:
                    provider = factories_1.GiftCardProviderFactory.getProvider(currentProvider);
                    const productId3 = providers[0].productId;
                    validationResult = await provider.getCatalogAvailability(productId3, amount);
                    break;
                default:
                    throw new ApiError_1.BadRequestError(`Product Type "${productType}" not found`);
            }
            if (!validationResult)
                throw new ApiError_1.BadRequestError("Invalid Request Data or Product Unavailable");
            if (productType === product_interface_1.ProductTypes.GiftCard && product.currency !== "NGN" && product.currency !== "COY") {
                const currency = product.currency || "";
                const price = await this.currencyService.convertCurrency(amount, currency, "NGN");
                const lprice = await this.currencyService.convertLocalCurrency(amount, currency, "NGN");
                productCurrency = "NGN";
                productAmount = ((0, big_js_1.default)(price)).toFixed(2);
                serviceFee = ((0, big_js_1.default)(lprice).minus(price)).toFixed(2);
            }
            if (productType === product_interface_1.ProductTypes.GiftCard && providers[0].productId === "cowry") {
                const _productCurrency = product.currency || "";
                if (!country)
                    throw new ApiError_1.BadRequestError("Country Required");
                const currency = country_to_currency_1.default[country.toString()];
                if (!currency)
                    throw new ApiError_1.BadRequestError("Invalid Country Code");
                const baseCurrency = "USD";
                const pricebaseCurrency = await this.currencyService.convertLocalCurrency(amount, _productCurrency, baseCurrency);
                let price = pricebaseCurrency;
                if (currency !== baseCurrency) {
                    const convertFunction = currency === "NGN" ? "convertLocalCurrency" : "convertCurrency";
                    price = await this.currencyService[convertFunction](parseFloat(pricebaseCurrency), baseCurrency, currency);
                }
                productCurrency = currency;
                productAmount = parseFloat(price);
            }
            const total = ((0, big_js_1.default)(productAmount).plus(serviceFee)).toFixed(2);
            let _order = {
                amount: productAmount, recipient,
                product: {
                    id: productID,
                    externalId: product_id,
                    amount,
                    name: product.name,
                    provider: currentProvider,
                    type: product.type,
                },
                currency: productCurrency,
                serviceFee,
                subTotal: productAmount,
                total,
                additionalInfo: {
                    [product.label]: recipient
                },
                prepaid: false
            };
            if (product.type === product_interface_1.ProductTypes.Electricity)
                _order = { ..._order, prepaid: prepaid };
            return _order;
        };
        this.getAllOrders = async (userId, page, limit, searchTerm) => {
            const _page = parseInt(page) ? parseInt(page) : 1;
            const _limit = parseInt(limit) ? parseInt(limit) : 10;
            const skip = (_page - 1) * _limit;
            let filter = { userId };
            if (searchTerm)
                filter = { ...filter, orderNumber: searchTerm };
            return await this.orderRepository.findAllWithPagination(filter, skip, _limit);
        };
        this.getOrdersByCredentials = async (data) => {
            return await this.orderRepository.findAll(data);
        };
        this.getOrderByCredentials = async (data) => {
            const response = await this.orderRepository.findOne(data);
            if (!response)
                throw new ApiError_1.BadRequestError('Order with the given credential does not exist.');
            return response;
        };
        this.updateOrderByCredentials = async (filter, data) => {
            return await this.orderRepository.updateOne(filter, data);
        };
        this.completeOrder = async (payment) => {
            const filter = { _id: payment.orderId, status: order_interface_1.OrderStatus.Pending };
            try {
                let response = {}, rawData, provider;
                let status = order_interface_1.OrderStatus.Successful;
                let orderStatusMessage = "Successful";
                const order = await this.getOrderByCredentials(filter);
                const product = order.product;
                const productType = product.type;
                const productAmount = product.amount;
                const product_id = product.externalId;
                const _response = await this.productRepository.findOne({ _id: product.id });
                if (!_response)
                    throw Error('Product with the given credential does not exist.');
                // Check Active Provider
                const providers = _response.providers?.filter(item => item.active === true);
                if (!providers || providers.length === 0)
                    throw Error("No Provider available");
                const currentProvider = providers[0].name;
                switch (productType) {
                    case product_interface_1.ProductTypes.Airtime:
                        provider = factories_1.AirtimeProviderFactory.getProvider(currentProvider);
                        rawData = await provider.fulfillOrder(productType, product_id, productAmount, order.recipient);
                        break;
                    case product_interface_1.ProductTypes.Data:
                        provider = factories_1.DataProviderFactory.getProvider(currentProvider);
                        rawData = await provider.fulfillOrder(productType, product_id, productAmount, order.recipient);
                        break;
                    case product_interface_1.ProductTypes.Betting:
                        provider = factories_1.BettingProviderFactory.getProvider(currentProvider);
                        rawData = await provider.fulfillOrder(productType, product_id, productAmount, order.recipient);
                        break;
                    case product_interface_1.ProductTypes.Electricity:
                        provider = factories_1.ElectricityProviderFactory.getProvider(currentProvider);
                        rawData = await provider.fulfillOrder(productType, product_id, productAmount, order.recipient, { prepaid: order.prepaid });
                        break;
                    case product_interface_1.ProductTypes.TV:
                        provider = factories_1.TVProviderFactory.getProvider(currentProvider);
                        rawData = await provider.fulfillOrder(productType, product_id, productAmount, order.recipient);
                        break;
                    case product_interface_1.ProductTypes.Internet:
                        provider = factories_1.InternetProviderFactory.getProvider(currentProvider);
                        rawData = await provider.fulfillOrder(productType, product_id, productAmount, order.recipient);
                        break;
                    case product_interface_1.ProductTypes.GiftCard:
                        provider = factories_1.GiftCardProviderFactory.getProvider(currentProvider);
                        rawData = await provider.fulfillOrder(product_id, productAmount, order.recipient);
                        break;
                    default:
                        throw new Error(`Product Type "${productType}" not found`);
                }
                response = rawData.data;
                const cardInfo = rawData.cardInfo;
                const reference = rawData.reference;
                if (rawData.orderStatus)
                    status = rawData.orderStatus;
                if (rawData.orderStatusMessage)
                    orderStatusMessage = rawData.orderStatusMessage;
                const additionalInfo = { ...order.additionalInfo, ...response };
                await this.updateOrderByCredentials(filter, { status, reference, additionalInfo, orderStatusMessage });
                await this.sendTransactionalEmail(payment.orderId.toString(), payment, cardInfo);
            }
            catch (error) {
                console.log(error);
                this.logger.error(error.message);
                await this.updateOrderByCredentials(filter, { status: order_interface_1.OrderStatus.Failed, orderStatusMessage: error.message });
            }
        };
        this.getTransactionVolumeByInterval = async (userId, interval) => {
            const startOfDay = (0, moment_1.default)().startOf(interval);
            const endOfDay = (0, moment_1.default)().endOf(interval);
            const query = [
                {
                    $match: {
                        userId,
                        status: "successful",
                        createdAt: { $gte: startOfDay.toDate(), $lt: endOfDay.toDate() },
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalAmount: { $sum: '$amountUSD' },
                    },
                },
            ];
            return await this.orderRepository.aggregate(query);
        };
        this.sendTransactionalEmail = async (orderId, payment, cardInfo) => {
            const order = await this.getOrderByCredentials({ _id: orderId });
            const { currency, amount, product, orderNumber, recipient, userId } = order;
            const user = await this.userService.getUserProfile(userId.toString());
            let emailData = {
                currency, amount,
                name: product.name,
                txRef: orderNumber,
                recipient,
                type: product.type.toUpperCase(),
                paymentMethod: payment.paymentMethod.toUpperCase(),
                date: new Date().toLocaleString(),
                email: user?.email
            };
            if (order.product.type === product_interface_1.ProductTypes.GiftCard) {
                emailData = { ...emailData, ...cardInfo };
                return await this.notificationService.sendGiftcardPaymentSuccessEmail(emailData);
            }
            else {
                return await this.notificationService.sendBillPaymentSuccessEmail(emailData);
            }
        };
    }
};
OrderService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [logger_service_1.LoggerClient,
        repositories_1.OrderRepository,
        repositories_1.ProductRepository,
        providers_1.PrimeAirtimeProvider,
        currency_service_1.default,
        cowry_service_1.default,
        user_service_1.default,
        notification_service_1.default])
], OrderService);
exports.default = OrderService;
