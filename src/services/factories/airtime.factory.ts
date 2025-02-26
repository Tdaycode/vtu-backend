import { ServiceProvider } from '../../interfaces/provider.interface';
import { PrimeAirtimeProvider } from '../../providers/primeAirtime.provider';
import { NotFoundError } from '../../utils/ApiError';

type AirtimeProviderMap = {
  [key: string]: ServiceProvider;
};

export class AirtimeProviderFactory {
  static factories: AirtimeProviderMap = {
    primeairtime: new PrimeAirtimeProvider()
  };

  static getProvider(factoryName: string): ServiceProvider {
    const factory = AirtimeProviderFactory.factories[factoryName];
    if (!factory) {
      throw new NotFoundError('Provider not found');
    }
    return factory;
  }
}
