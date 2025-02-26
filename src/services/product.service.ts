import { ManualProductProvider } from './../interfaces/provider.interface';
import { Service } from 'typedi';
import { ObjectId } from 'mongodb';
import { Schema } from 'mongoose';
import ProductRepository from '../repositories/product.repository';
import { BadRequestError } from '../utils/ApiError';
import { IProduct, IProductDocument, PaymentTypes, ProductTypes, Providers, ServiceTypes } from '../interfaces/product.interface';
import { IGetServiceInfo, ServiceProvider } from '../interfaces/provider.interface';
import { InternetProviderFactory, ElectricityProviderFactory, TVProviderFactory, 
  BettingProviderFactory, AirtimeProviderFactory, ManualProviderFactory } from './factories';
import { InternetTransformer,  TVTransformer, ElectricityTransformer, ManualProductTransformer,
  BettingTransformer, DataTransformer, AirtimeTransformer } from './transformers';
import { LoggerClient } from './logger.service';
import CurrencyService from './currency.service';
import CowryService from './cowry.service';
import { CategoryRepository } from '../repositories';
import { GiftlyProvider } from '../providers';

@Service()
export default class ProductService {
  constructor(
    public logger: LoggerClient,
    public productRepository: ProductRepository,
    public categoryRepository: CategoryRepository,
    public currencyService: CurrencyService,
    public giftlyProvider: GiftlyProvider,
    public cowryService: CowryService
  ) { }

  creatProduct = async (data: IProduct) => {
    return await this.productRepository.create(data);
  };

  getAllProducts = async (page: string, limit: string, searchTerm: string) => {
    const _page = parseInt(page) ? parseInt(page) : 1;
    const _limit = parseInt(limit) ? parseInt(limit) : 10;
    const skip: number = (_page - 1) * _limit;
    let filter: any = { }, sort: any = { };

    if(searchTerm)  {
      const regexQuery = new RegExp(searchTerm, 'i');
      filter = {
        ...filter, 
        name: { $regex: regexQuery }
      }
      sort =  {};
    }
    
    return await this.productRepository.findAllWithPagination(filter, sort, skip, _limit);
  };

  getProducts = async () => {
    return await this.productRepository.findAll();
  };

  getProductsByCredentials = async (data: any) => {
    return await this.productRepository.findAll(data);
  };

  getProductById = async (productId: Schema.Types.ObjectId) => {
    const _productId = new ObjectId(productId.toString());
    return await this.productRepository.findOne({ _id: new ObjectId(_productId) });
  };

  getAllProductByCategory = async (data: any) => {
    return await this.productRepository.findAll(data);
  };

  getProductByCredentials = async (data: any) => {
    const response = await this.productRepository.findOne(data);
    if (!response) throw new BadRequestError('Product with the given credential does not exist.');
    return response;
  };

  searchProduct = async (searchTerm: string, country: string) => {
    const response = await this.productRepository.search(searchTerm, country);
    return response;
  };

  editProduct = async (id: string, data: Partial<IProductDocument>) => {
    const response = await this.productRepository.findOne({ _id: id });
    if (!response) throw new BadRequestError('Product with the given credential does not exist.');
    return await this.productRepository.updateOne({ _id: id }, data);
  };

  public createProduct = async (data: Partial<IProductDocument>) => {
    const category = await this.categoryRepository.findOne({ _id: data.category });
    if(!category) throw new BadRequestError('Category does not exist.');
    return await this.productRepository.create({
      ...data,
      type: ProductTypes.Manual,
    });
  };

  getProductInfo = async (productId: string, receipient: string) => {
   try {
     let provider: ServiceProvider | ManualProductProvider, rawInfo :any = {}, transformedData: any;
     const response = await this.productRepository.findOne({ sid: productId });
     if (!response) throw new BadRequestError('Product with the given credential does not exist.');
 
     // Check Active Provider
     const providers = response.providers?.filter(item => item.active === true);
     if(!providers || providers.length === 0) throw new BadRequestError("No Provider available")
     const product_id = providers[0].productId; 
     const serviceId = providers[0].serviceId;
     const currentProvider = providers[0].name;
     const productType = response.type;
 
     const rawData = {
       product: response,
       type: productType,
       provider: currentProvider,
       productName: response.name
     } 
 
     const servicePayload: IGetServiceInfo = { receipient, productType, serviceId, product_id };
 
     switch (productType) {
       case ProductTypes.Airtime:
         provider = AirtimeProviderFactory.getProvider(currentProvider);
         rawInfo = await provider.getAirtimeTopUpInfo(receipient, product_id);
         transformedData = AirtimeTransformer.airtime({ ...rawInfo, ...rawData, product_id }, currentProvider); 
         break;
 
       case ProductTypes.Data:
         provider = AirtimeProviderFactory.getProvider(currentProvider);
         rawInfo = await provider.getDataTopUpInfo(receipient);
         transformedData = DataTransformer.Data({ ...rawInfo, ...rawData }, currentProvider);
         break;
 
       case ProductTypes.Betting:
         provider = BettingProviderFactory.getProvider(currentProvider);
         rawInfo = await provider.getBettingInfo(servicePayload);
         transformedData = BettingTransformer.betting({ ...rawInfo, ...rawData, product_id }, currentProvider);
         break;
 
       case ProductTypes.Electricity:
         provider = ElectricityProviderFactory.getProvider(currentProvider);
         rawInfo = await provider.getElectricityInfo(servicePayload);
         transformedData = ElectricityTransformer.electricity({ ...rawInfo, ...rawData }, currentProvider);
         break;
       
       case ProductTypes.TV:
         provider = TVProviderFactory.getProvider(currentProvider);
         rawInfo = await provider.getTVInfo(servicePayload);
         transformedData = TVTransformer.tv({ ...rawInfo, ...rawData, product_id }, currentProvider);
         break;
 
       case ProductTypes.Internet:
         provider = InternetProviderFactory.getProvider(currentProvider);
         rawInfo = await provider.getInternetInfo(servicePayload);
         transformedData = InternetTransformer.internet({ ...rawInfo, ...rawData }, currentProvider);
         break; 

      case ProductTypes.Manual:
         provider = ManualProviderFactory.getProvider(currentProvider);
         rawInfo = provider.getManualProductAvailability();
         transformedData = ManualProductTransformer.manual({ ...rawInfo, ...rawData }, currentProvider);
         break; 
 
       // case ProductTypes.GiftCard:
       //   rawInfo = { product_id, country, productCurrency: response.currency };
       //   transformedData = this.cowryService.getCowryProductInfo({ ...rawInfo, ...rawData });
       //   break; 
 
       default:
         throw new BadRequestError(`Product Type "${productType}" not found`);
     }
 
     return transformedData;
   } catch (error: any) {
      this.logger.error(error?.message || "Something went wrong");
      throw error;
   }
  };

  public checkGiftlyCatalogUpdate = async () => {
    try {
      const catalogs = await this.giftlyProvider.getCatalogs();
      const category = await this.categoryRepository.findOne({ name: "Gift Card" });
      const baseFilter = { 'providers.name': Providers.Giftly };
      const products = await this.productRepository.findAll(baseFilter);
      
      for (const product of catalogs.results) {
        const response = products.find((p) => {
          if(p.providers && p.providers?.length > 0) {
            const productId = p?.providers[0].productId
            return productId === product.sku.toString()
          }
        });
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
            providers:[{
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
      
      const _deleteFilter = { $nin: catalogs.results.map(p => p.sku.toString()) };
      const deleteFilter = { ...baseFilter, 'providers.productId': _deleteFilter };
      await this.productRepository.deleteMany(deleteFilter);

      this.logger.info('Gifly Catalog Synchronization complete.');
    } catch (err) {
      console.log(err)
      this.logger.error("Gifly Catalog Synchronization failed");
    }
  }; 
}
