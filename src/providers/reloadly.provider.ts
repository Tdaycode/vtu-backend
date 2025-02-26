import { ServiceProvider } from '../interfaces/provider.interface';
import { HttpClient } from '../utils/http-client.util';
import { BadRequestError } from '../utils/ApiError';
import config from '../config/Config';
import { Service } from 'typedi';
import { ReloadlyAccessTokenResponse, ReloadlyGetOperatorResponse } from '../interfaces/responses/reloadly.response.interface';
import { ProductTypes, ServiceTypes } from '../interfaces/product.interface';

@Service()
export class ReloadlyProvider {
  getInternetInfo(receipient: string, productType: ProductTypes, serviceId: ServiceTypes, product_id: string) {
    throw new Error('Method not implemented.');
  }
  getTVInfo(receipient: string, productType: ProductTypes, serviceId: ServiceTypes, product_id: string) {
    throw new Error('Method not implemented.');
  }
  getElectricityInfo(receipient: string, productType: ProductTypes, serviceId: ServiceTypes, product_id: string) {
    throw new Error('Method not implemented.');
  }
  getBettingInfo(id: string) {
    throw new Error('Method not implemented.');
  }
  getAirtimeTopUpInfo(id: string) {
    throw new Error('Method not implemented.');
  }
  getDataTopUpInfo(id: string) {
    throw new Error('Method not implemented.');
  }
  getBillPaymentInfo(id: string) {
    throw new Error('Method not implemented.');
  }

//   constructor(public httpClient: HttpClient) { }

  public async getPrepaidProductByOperatorID(id: string) {
    const audience = config.reloadlyTopupBaseUrl;
    const url = `${config.reloadlyTopupBaseUrl}/operators/${id}`;
    const accessToken = await this.getAccessToken(audience);

    const headers = {
        Authorization: `Bearer ${accessToken}`,
    };
    
    const response = await new HttpClient(url).get<ReloadlyGetOperatorResponse>('', headers);

    return response;
  }

  public async getPrepaidProductsByCountry(countryCode: string) {
    const audience = config.reloadlyTopupBaseUrl;
    const url = `${config.reloadlyTopupBaseUrl}/operators/countries/${countryCode}?suggestedAmountsMap=true&suggestedAmounts=true&includeData=true`;
    
    const accessToken = await this.getAccessToken(audience);

    const headers = {
        Authorization: `Bearer ${accessToken}`,
    };
    
    const response = await new HttpClient(url).get<ReloadlyGetOperatorResponse[]>('', headers);

    return response;
  }
  
  private async getAccessToken(audience: string) {
    const url = `${config.reloadlyAuthBaseUrl}/oauth/token`;

    const body = {
        client_id: config.reloadlyClientId,
        client_secret: config.reloadlyClientSecret,
        grant_type: "client_credentials",
        audience
    };

    const response = await new HttpClient(url).post<ReloadlyAccessTokenResponse>('', body);
    return response.access_token;
  }
}




