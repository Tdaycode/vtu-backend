import { uuid } from 'uuidv4';
import { Service } from 'typedi';
import CowryService from '../services/cowry.service';


@Service()
export class GiftCopProvider {
  public async getCatalogAvailability() {
    return true
  }

  public async fulfillOrder(productId: string, amount: number, recipient: string) {
    const reference = uuid();
    const cowry = await CowryService.createCowryVoucher(amount);

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
}




