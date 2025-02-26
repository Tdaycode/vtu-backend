import { GiftCardProvider, IFulfillOrder, ServiceProvider } from '../interfaces/provider.interface';
import { HttpClient } from '../utils/http-client.util';
import { uuid } from 'uuidv4';
import config from '../config/Config';
import { Service } from 'typedi';
import { ProductTypes, ServiceTypes } from '../interfaces/product.interface';
import { BadRequestError } from '../utils/ApiError';
import { IOrder, OrderStatus } from '../interfaces/order.interface';
import { IGetValueTopupCatalog, IGetValueTopupMobileLookup, IValueTopupPurchasePayLoadAPI } from '../interfaces/responses/valuetopup.response.interface';

@Service()
export class ValueTopupProvider implements ServiceProvider, GiftCardProvider {
  public async getCatalogAvailability() {
    return true
  }

  public async getAirtimeTopUpInfo(phoneNumber: string, product_id: string) {
    try {
      const url = `${config.valueTopupBaseUrl}/v2/lookup/mobile/${phoneNumber}`;
      const accessToken = await this.generateAccessToken();

      const headers = {
        Authorization: `Basic ${accessToken}`
      };

      const response = await new HttpClient(url).get<IGetValueTopupMobileLookup>('', headers);
      if(response.responseCode !== "000") throw new Error(response.responseMessage) 
      return response;
    } catch (error: any) {
      throw new BadRequestError(error?.message || "Something went wrong")
    }
  }

  public async fulfillOrder(payload: IFulfillOrder) {
    const { productType: type, productId, amount, order } = payload;
    const reference = uuid();
    // if(config.activeEnvironment === "development") return { reference, data };
    
    if(type === ProductTypes.Airtime) {
      const response = await this.executeAirtimeTopUp(order, productId, amount.toString(), reference);
      return { reference, data: response, orderStatusMessage: response.responseMessage, orderStatus: OrderStatus.Successful };    
    }

    if(type === ProductTypes.GiftCard) {
      const info = await this.executeGiftcardTopUp(productId, amount, order);
      return { reference: info.reference, data: info.data, cardInfo: info.cardInfo };
    }

    throw new Error("Not Supported");
  }

  public async executeGiftcardTopUp(productId: string, amount: number, order: IOrder) {
    const reference = uuid();
    const _order = await this.executeGiftCardTopUp(order, productId, amount, reference);
    const success = _order?.responseCode === "000";
    const giftCard = _order.payLoad.giftCardDetail;

    const response = {
      "Gift Card Number": success ? giftCard.cardNumber : "Not yet Available",
      "Claim Link": success ? giftCard.certificateLink : "Not yet Available",
      "Gift Card PIN": success ? giftCard.pin : "Not yet Available"
    };

    const cardInfo = {
      "cardSerialNumber": success ? giftCard?.cardNumber : "Not yet Available",
      "cardPIN": success ? giftCard?.pin : "Not yet Available",
      "claimLink": success ? giftCard?.certificateLink : "Not yet Available"
    }

    return { reference, data: response, cardInfo, status: 201 };
  }

  public async getCatalog() {
    const url = `${config.valueTopupBaseUrl}/v2/catalog/products`;
    const accessToken = await this.generateAccessToken();

    const headers = {
      Authorization: `Basic ${accessToken}`
    };

    const response = await new HttpClient(url).get<IGetValueTopupCatalog>('', headers);
    return response;
  }

  public async getDataTopUpInfo(phoneNumber: string) {
    throw new Error("Not Supported")
  }

  public async getBettingInfo() {
    throw new Error("Not Supported")
  }

  public async getInternetInfo() {
    throw new Error("Not Supported")
  }

  public async getElectricityInfo() {
    throw new Error("Not Supported")
  }

  public async getTVInfo() {
    throw new Error("Not Supported")
  }


  public async getBillPaymentInfo(type: ServiceTypes) {
    throw new Error("Not Supported")
  }

  public async executeAirtimeTopUp(order: IOrder, product_id: string, denomination: string, reference: string) {
    try {
      const url = `${config.valueTopupBaseUrl}/v2/transaction/topup`;
      const accessToken = await this.generateAccessToken();

      const body = {
        skuId: product_id,
        correlationId: reference,
        mobile: order.recipient,
        amount: denomination,
        transactionCurrencyCode: order.currency
      };

      const headers = {
        Authorization: `Basic ${accessToken}`
      };

      const response = await new HttpClient(url).post<IValueTopupPurchasePayLoadAPI>('', body, headers);
      if(response.responseCode !== "000") throw new BadRequestError("Top Up Failed");
      return response;
    } catch (error: any) {
      throw Error(error)
    }
  }

  public async executeGiftCardTopUp(order: IOrder, product_id: string, amount: number, reference: string) {
    try {
      const url = `${config.valueTopupBaseUrl}/v2/transaction/giftcard/order`;
      const accessToken = await this.generateAccessToken();

      const body = {
        amount, skuId: product_id,
        correlationId: reference,
        firstName: order.recipient,
        lastName: "TeleBank",
        recipient: order.recipient
      };

      const headers = {
        Authorization: `Basic ${accessToken}`
      };

      const response = await new HttpClient(url).post<IValueTopupPurchasePayLoadAPI>('', body, headers);
      if(response.responseCode !== "000") throw new BadRequestError("Giftcard Top Up Failed");
      return response;
    } catch (error: any) {
      throw Error(error)
    }
  }

  public async executeElectricityTopUp() {
    throw new Error("Not Supported")
  }

  public async executeTVTopUp() {
    throw new Error("Not Supported")
  }

  public async executeBettingTopUp() {
    throw new Error("Not Supported")
  }

  public async executeInternetTopUp() {
    throw new Error("Not Supported")
  }

  private async generateAccessToken() {
    const credentials = `${config.valueTopupUserName}:${config.valueTopupPassword}`;
    const encodedCredentials = Buffer.from(credentials).toString('base64');
    return encodedCredentials;
  }
}




