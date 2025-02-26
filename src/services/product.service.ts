import { Service } from 'typedi';
import { ObjectId } from 'mongodb';
import { Schema } from 'mongoose';
import ProductRepository from '../repositories/product.repository';
import { BadRequestError } from '../utils/ApiError';
import { IProduct, ProductTypes } from '../interfaces/product.interface';
import { PrimeAirtimeProvider } from '../providers';
import { ServiceProvider } from '../interfaces/provider.interface';
import { InternetProviderFactory, ElectricityProviderFactory, TVProviderFactory, 
  BettingProviderFactory, AirtimeProviderFactory} from './factories';
import { InternetTransformer,  TVTransformer, ElectricityTransformer, 
  BettingTransformer, DataTransformer, AirtimeTransformer } from './transformers';
import { LoggerClient } from './logger.service';
import CurrencyService from './currency.service';
import { CowryService } from '.';

@Service()
export default class ProductService {
  constructor(
    public logger: LoggerClient,
    public productRepository: ProductRepository,
    public primeAirtimeProvider: PrimeAirtimeProvider,
    public currencyService: CurrencyService,
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

  getProductInfo = async (productId: string, receipient: string) => {
    let provider: ServiceProvider, rawInfo :any = {}, transformedData: any;
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
      type: productType,
      provider: currentProvider,
      productName: response.name
    } 

    switch (productType) {
      case ProductTypes.Airtime:
        provider = AirtimeProviderFactory.getProvider(currentProvider);
        rawInfo = await provider.getAirtimeTopUpInfo(receipient);
        transformedData = AirtimeTransformer.airtime({ ...rawInfo, ...rawData }, currentProvider);
        break;

      case ProductTypes.Data:
        provider = AirtimeProviderFactory.getProvider(currentProvider);
        rawInfo = await provider.getDataTopUpInfo(receipient);
        transformedData = DataTransformer.Data({ ...rawInfo, ...rawData }, currentProvider);
        break;

      case ProductTypes.Betting:
        provider = BettingProviderFactory.getProvider(currentProvider);
        rawInfo = await provider.getBettingInfo(receipient, productType, serviceId, product_id);
        transformedData = BettingTransformer.betting({ ...rawInfo, ...rawData }, currentProvider);
        break;

      case ProductTypes.Electricity:
        provider = ElectricityProviderFactory.getProvider(currentProvider);
        rawInfo = await provider.getElectricityInfo(receipient, productType, serviceId, product_id);
        transformedData = ElectricityTransformer.electricity({ ...rawInfo, ...rawData }, currentProvider);
        break;
      
      case ProductTypes.TV:
        provider = TVProviderFactory.getProvider(currentProvider);
        rawInfo = await provider.getTVInfo(receipient, productType, serviceId, product_id);
        transformedData = TVTransformer.tv({ ...rawInfo, ...rawData }, currentProvider);
        break;

      case ProductTypes.Internet:
        provider = InternetProviderFactory.getProvider(currentProvider);
        rawInfo = await provider.getInternetInfo(receipient, productType, serviceId, product_id);
        transformedData = InternetTransformer.internet({ ...rawInfo, ...rawData }, currentProvider);
        break; 

      // case ProductTypes.GiftCard:
      //   rawInfo = { product_id, country, productCurrency: response.currency };
      //   transformedData = this.cowryService.getCowryProductInfo({ ...rawInfo, ...rawData });
      //   break; 

      default:
        throw new BadRequestError(`Product Type "${productType}" not found`);
    }

    return transformedData;
  };
}
