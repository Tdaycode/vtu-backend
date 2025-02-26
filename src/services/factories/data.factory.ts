import { ServiceProvider } from '../../interfaces/provider.interface';
import { PrimeAirtimeProvider } from '../../providers/primeAirtime.provider';
import { NotFoundError } from '../../utils/ApiError';

type DataProviderMap = {
  [key: string]: ServiceProvider;
};

export class DataProviderFactory {
  static factories: DataProviderMap = {
    primeairtime: new PrimeAirtimeProvider()
  };

  static getProvider(factoryName: string): ServiceProvider {
    const factory = DataProviderFactory.factories[factoryName];
    if (!factory) {
      throw new NotFoundError('Provider not found');
    }
    return factory;
  }
}
