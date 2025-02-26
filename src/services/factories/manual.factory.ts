import { Providers } from '../../interfaces/product.interface';
import { ManualProductProvider } from '../../interfaces/provider.interface';
import { TeleBankProvider } from '../../providers';
import { NotFoundError } from '../../utils/ApiError';

type ManualProviderMap = {
  [key: string]: ManualProductProvider;
};

export class ManualProviderFactory {
  static factories: ManualProviderMap = {
    [Providers.TeleBank]: new TeleBankProvider(),
  };

  static getProvider(factoryName: string): ManualProductProvider {
    const factory = ManualProviderFactory.factories[factoryName];
    if (!factory) {
      throw new NotFoundError('Provider not found');
    }
    return factory;
  }
}
