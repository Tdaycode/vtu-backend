import moment from 'moment';
import { uuid } from 'uuidv4';
import { HttpClient } from '../utils/http-client.util';
import config from '../config/Config';
import { Service } from 'typedi';
import TokenService from '../services/token.service';
import { TokenTypes } from '../interfaces/token.interface';
import { encode, decode } from '../utils/crypto';
import { BadRequestError } from '../utils/ApiError';
import { GiftlyAccessTokenResponse, GiftlyCatalogAvailabilityResponse, 
  GiftlyCatalogResponse, GiftlyCreateOrderResponse, GiftlyOrderCardsResponse } from '../interfaces/responses/giftly.response.interface';
import { IFulfillOrder } from '../interfaces/provider.interface';

@Service()
export class GiftlyProvider {
  public async getCatalogs() {
    const url = `${config.giftlyBaseUrl}/catalogs/`;
    const accessToken = await this.retrieveAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };

    const response = await new HttpClient(url).get<GiftlyCatalogResponse>('', headers);
    return response;
  }

  public async getCatalogAvailability(product_sku: string, price: number) {
    const url = `${config.giftlyBaseUrl}/catalogs/${product_sku}/availability/?item_count=1&price=${price}`;
    const accessToken = await this.retrieveAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };

    const response = await new HttpClient(url).get<GiftlyCatalogAvailabilityResponse>('', headers);
    return response.availability;
  }

  public async fulfillOrder(payload: IFulfillOrder) {
    const { productId, amount, order } = payload;

    const reference = uuid();
    const _order = await this.createOrder(reference, productId, amount, order.recipient);
    if(_order?.status === -1) throw new BadRequestError(_order?.detail)
    if(!_order?.reference_code) throw new BadRequestError(_order?.detail)
    const orderCard = await this.getOrderCards(_order.reference_code);
    const success = _order?.status === 1;

    const response = {
      "Gift Card Number": success ? orderCard?.card_number : "Not yet Available",
      "Claim Link": success ? _order.share_link : "Not yet Available",
      "Gift Card PIN": success ? orderCard?.pin_code : "Not yet Available"
    }

    const cardInfo = {
      "cardSerialNumber": success ? orderCard?.card_number : "Not yet Available",
      "cardPIN": success ? orderCard?.pin_code : "Not yet Available",
      "claimLink": success ? orderCard?.claim_url : "Not yet Available"
    }

    return { reference, data: response, cardInfo };
  }

  public async createOrder(reference: string, sku: string, price: number, recipient: string) {
    const url = `${config.giftlyBaseUrl}/orders/`;
    const accessToken = await this.retrieveAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };

    const body = {
      sku, quantity: 1, price, reference_code: reference,
      pre_order: false, destination: recipient,
      terminal_id: config.giftlyTerminalId,
      terminal_pin: config.giftlyTerminalPin
    };

    const response = await new HttpClient(url).post<GiftlyCreateOrderResponse>('', body, headers);
    return response;
  }

  public async getOrderCards(reference: string) {
    const url = `${config.giftlyBaseUrl}/orders/${reference}/cards/`;
    const accessToken = await this.retrieveAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };

    const response = await new HttpClient(url).get<GiftlyOrderCardsResponse>('', headers);
    return response?.results[0] ?? null;
  }

  private async getAccessToken(): Promise<GiftlyAccessTokenResponse> {
    try {
      const url = `${config.giftlyBaseUrl}/auth/token/`;
  
      const body = {
        client_id: config.giftlyClientId,
        secret_key: config.giftlySecretKey
      };
  
      const response = await new HttpClient(url).post<GiftlyAccessTokenResponse>('', body);
      return response;
    } catch (error) {
      throw new BadRequestError("error")
    }
  }

  private async storeAccessToken(tokenObject: GiftlyAccessTokenResponse) {
    const expiryDate = (moment().add(tokenObject.expire, 'seconds')).toDate();
    const hashedToken = await encode(tokenObject.access);
    await TokenService.storeToken(hashedToken, expiryDate, TokenTypes.Giftly);
  }

  private async retrieveAccessToken() {
    const response = await TokenService.retrieveToken(TokenTypes.Giftly);
    if (!response) {
      const tokenObj = await this.getAccessToken();
      await this.storeAccessToken(tokenObj);
      return tokenObj.access;
    }

    const expiryDate = new Date(response.expires);
    if (expiryDate > new Date()) {
      const token = await decode(response.token);
      return token;
    } else {
      const tokenObj = await this.getAccessToken();
      await this.storeAccessToken(tokenObj);
      return tokenObj.access;
    }
  }
}




