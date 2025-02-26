import { Providers } from '../../interfaces/product.interface';
import { ServiceProvider } from '../../interfaces/provider.interface';
import { ValueTopupProvider } from '../../providers';
import { InterSwitchProvider } from '../../providers/interswitch.provider';
import { PrimeAirtimeProvider } from '../../providers/primeAirtime.provider';
import { NotFoundError } from '../../utils/ApiError';

type AirtimeProviderMap = {
  [key: string]: ServiceProvider;
};

export class AirtimeProviderFactory {
  static factories: AirtimeProviderMap = {
    [Providers.PrimeAirtime]: new PrimeAirtimeProvider(),
    [Providers.Interswitch]: new InterSwitchProvider(),
    [Providers.ValueTopup]: new ValueTopupProvider(),
  };

  static getProvider(factoryName: string): ServiceProvider {
    const factory = AirtimeProviderFactory.factories[factoryName];
    if (!factory) {
      throw new NotFoundError('Provider not found');
    }
    return factory;
  }
}
