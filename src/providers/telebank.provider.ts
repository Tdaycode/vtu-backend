import { uuid } from 'uuidv4';
import { Service } from 'typedi';
import CowryService from '../services/cowry.service';
import { Container } from 'typedi';
import { GiftCardProvider, IFulfillOrder, ManualProductProvider } from '../interfaces/provider.interface';

const cowryService = Container.get(CowryService);

@Service()
export class TeleBankProvider implements GiftCardProvider, ManualProductProvider {
  public async getCatalogAvailability() {
    return true
  }

  public async fulfillOrder(payload: IFulfillOrder) {
    const { amount, order } = payload;
    const reference = uuid();
    const cowry = await cowryService.createCowryVoucher(amount, order.userId.toString());

    const response = {
      "Gift Card Number": cowry.code,
      "Gift Card PIN": cowry.pin
    }

    const cardInfo = {
      "cardSerialNumber": cowry.code,
      "cardPIN": cowry.pin,
      "claimLink": "N/A"
    }

    return { reference, data: response, cardInfo};
  }

  public getManualProductAvailability() {
    return true;
  }
}




