import { Service } from 'typedi';
import { GiftCardProvider } from '../../interfaces/provider.interface';
import { TelebankProvider } from '../../providers';
import { GiftlyProvider } from '../../providers/giftly.provider';
import { NotFoundError } from '../../utils/ApiError';

type GiftCardProviderMap = {
  [key: string]: GiftCardProvider;
};

@Service()
export class  GiftCardProviderFactory {
  static factories: GiftCardProviderMap = {
    giftly: new GiftlyProvider(),
    telebank: new TelebankProvider()
  };

  static getProvider(factoryName: string): GiftCardProvider {
    const factory = GiftCardProviderFactory.factories[factoryName];
    if (!factory) {
      throw new NotFoundError('Provider not found');
    }
    return factory;
  }
}
