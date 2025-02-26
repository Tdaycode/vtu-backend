import { ServiceProvider } from '../../interfaces/provider.interface';
import { InterSwitchProvider } from '../../providers/interswitch.provider';
import { PrimeAirtimeProvider } from '../../providers/primeAirtime.provider';
import { NotFoundError } from '../../utils/ApiError';

type ElectricityProviderMap = {
  [key: string]: ServiceProvider;
};

export class ElectricityProviderFactory {
  static factories: ElectricityProviderMap = {
    primeairtime: new PrimeAirtimeProvider(),
    interswitch: new InterSwitchProvider(),
  };
      
  static getProvider(factoryName: string): ServiceProvider {
    const factory = ElectricityProviderFactory.factories[factoryName];
    if (!factory) {
      throw new NotFoundError('Provider not found');
    }
    return factory;
  }
}
