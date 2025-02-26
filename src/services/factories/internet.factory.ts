import { ServiceProvider } from '../../interfaces/provider.interface';
import { PrimeAirtimeProvider } from '../../providers/primeAirtime.provider';
import { NotFoundError } from '../../utils/ApiError';

type InternetProviderMap = {
  [key: string]: ServiceProvider;
};

export class InternetProviderFactory {
  static factories: InternetProviderMap = {
    primeairtime: new PrimeAirtimeProvider()
  };

  static getProvider(factoryName: string): ServiceProvider {
    const factory = InternetProviderFactory.factories[factoryName];
    if (!factory) {
      throw new NotFoundError('Provider not found');
    }
    return factory;
  }
}
