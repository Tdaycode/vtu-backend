import { ServiceProvider } from '../../interfaces/provider.interface';
import { PrimeAirtimeProvider } from '../../providers/primeAirtime.provider';
import { NotFoundError } from '../../utils/ApiError';

type TVProviderMap = {
  [key: string]: ServiceProvider;
};

export class  TVProviderFactory {
  static factories: TVProviderMap = {
    primeairtime: new PrimeAirtimeProvider()
  };

  static getProvider(factoryName: string): ServiceProvider {
    const factory = TVProviderFactory.factories[factoryName];
    if (!factory) {
      throw new NotFoundError('Provider not found');
    }
    return factory;
  }
}
