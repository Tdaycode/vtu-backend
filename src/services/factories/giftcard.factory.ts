import { Service } from 'typedi';
import { Providers } from '../../interfaces/product.interface';
import { GiftCardProvider } from '../../interfaces/provider.interface';
import { TeleBankProvider, ValueTopupProvider } from '../../providers';
import { GiftlyProvider } from '../../providers/giftly.provider';
import { NotFoundError } from '../../utils/ApiError';

type GiftCardProviderMap = {
  [key: string]: GiftCardProvider;
};

@Service()
export class  GiftCardProviderFactory {
  static factories: GiftCardProviderMap = {
    [Providers.Giftly]: new GiftlyProvider(),
    [Providers.TeleBank]: new TeleBankProvider(),
    [Providers.ValueTopup]: new ValueTopupProvider(),
  };

  static getProvider(factoryName: string): GiftCardProvider {
    const factory = GiftCardProviderFactory.factories[factoryName];
    if (!factory) {
      throw new NotFoundError('Provider not found');
    }
    return factory;
  }
}
