import { ExtraMap, IFulfillOrder, IGetServiceInfo, ServiceProvider } from '../interfaces/provider.interface';
import { HttpClient } from '../utils/http-client.util';
import { uuid } from 'uuidv4';
import config from '../config/Config';
import { Service } from 'typedi';
import TokenService from '../services/token.service';
import { PrimeAirtimeAccessTokenResponse, PrimeAirtimeTopUpInfoResponse, PrimeAirtimeExecuteTopUpResponse, PrimeAirtimeTVValidationResponse,
  PrimeAirtimeBettingValidationResponse, PrimeAirtimeProductResponse, PrimeAirtimeElectricityValidationResponse } from '../interfaces/responses/primeAirtime.response.interface';
import { TokenTypes } from '../interfaces/token.interface';
import { encode, decode } from '../utils/crypto';
import { ProductIDs, ProductTypes, ServiceTypes } from '../interfaces/product.interface';
import { BadRequestError } from '../utils/ApiError';
import { IOrder, OrderStatus } from '../interfaces/order.interface';

@Service()
export class PrimeAirtimeProvider implements ServiceProvider {
  public async getAirtimeTopUpInfo(phoneNumber: string, product_id: string) {
    if(product_id === ProductIDs.PRIME_AIRTIME_SMILE_RECHARGE) {
      const payload = { receipient: phoneNumber, productType: ProductTypes.Internet, serviceId: ServiceTypes.Internet, product_id }
      const response = await this.getBillPayment(payload);
      return response;
    }

    const url = `${config.primeAirtimeBaseUrl}/topup/info/${phoneNumber}`;
    const accessToken = await this.retrieveAccessToken();

    const headers = {
      Authorization: `Bearer ${accessToken}`
    };

    const response = await new HttpClient(url).get<PrimeAirtimeTopUpInfoResponse>('', headers);

    return response;
  }

  public async fulfillOrder(payload: IFulfillOrder) {
    const { productType: type, productId, amount, order } = payload;
    const reference = uuid();
    let response: PrimeAirtimeExecuteTopUpResponse, data: any = {}; 

    // if(config.activeEnvironment === "development") return { reference, data };

    switch (type) {
      case ProductTypes.Airtime:
        response = await this.executeAirtimeTopUp(order, productId, amount.toString(), reference);
        break;

      case ProductTypes.Data:
        response = await this.executeAirtimeTopUp(order, productId, amount.toString(), reference);
        break;

      case ProductTypes.Electricity:
        const prepaid = order.prepaid;
        response = await this.executeElectricityTopUp(order.recipient, productId, amount.toString(), reference, prepaid);
        if(response?.pin_code) {
          data = {
            "Electricity PIN": response?.pin_code,
            "PIN Message": response?.pin_option1 ?? "Use the Voucher/PIN"
          };
        }
        break;

      case ProductTypes.TV:
        response = await this.executeTVTopUp(order, productId, reference);
        if(response?.pin_code) {
          data = {
            [`${order.product.name } PIN`]: response?.pin_code,
            "PIN Message": response?.pin_option1 ?? "Use the Voucher/PIN"
          };
        }
        break;

      case ProductTypes.Betting:
        response = await this.executeBettingTopUp(order.recipient, amount.toString(), productId, reference);
        break;

      case ProductTypes.Internet:
        response = await this.executeInternetTopUp(order, amount.toString(), productId, reference);
        break;

      default:
        throw new Error(`Product Type "${type}" not found`);
    }

    let orderStatus = "";

    if(Number(response.status) === 201)  {
      orderStatus = OrderStatus.Successful
    } else if(Number(response.status) === 208) {
      orderStatus = OrderStatus.Pending
    } else {
      orderStatus = OrderStatus.Failed
    }


    console.log({ reference, data, orderStatusMessage: response.message, orderStatus })
    return { reference, data, orderStatusMessage: response.message, orderStatus };    
  }

  public async getDataTopUpInfo(phoneNumber: string) {
    const url = `${config.primeAirtimeBaseUrl}/datatopup/info/${phoneNumber}`;
    const accessToken = await this.retrieveAccessToken();

    const headers = {
      Authorization: `Bearer ${accessToken}`
    };

    const response = await new HttpClient(url).get<PrimeAirtimeTopUpInfoResponse>('', headers);

    return response;
  }

  public async getBettingInfo(payload: IGetServiceInfo) {
    const response = await this.getBillPayment(payload)
    return response;
  }

  public async getInternetInfo(payload: IGetServiceInfo) {
    const response = await this.getBillPayment(payload)
    return response;
  }

  public async getElectricityInfo(payload: IGetServiceInfo) {
    const response = await this.getBillPayment(payload)
    return response;
  }

  public async getTVInfo(payload: IGetServiceInfo) {
    const response = await this.getBillPayment(payload)
    return response;
  }

  public async getBillPayment(payload: IGetServiceInfo) {
    const { productType, serviceId, receipient, product_id } = payload;
    let result: any, info: any

    if(product_id === ProductIDs.PRIME_AIRTIME_BENIN) {
      const product = [{
        currency: "NGN",
        max_denomination: "300000",
        minAmount: "500",
        hasOpenRange: true,
        name: "Benin Electricity - BEDC",
        product_id
      }]
      result = await this.validateElectricityInput(receipient, product_id);
      info = {  ...result, products: product };
      return info;
    }

    const services = await this.getBillPaymentInfo(serviceId);
    const product = services.products.filter(item => item.product_id === product_id);
    if(product[0]?.hasValidate) {
      if(productType === ProductTypes.Betting) result = await this.validateBettingInput(receipient, product_id);
      if(productType === ProductTypes.TV && product_id === ProductIDs.PRIME_AIRTIME_DSTV || product_id === ProductIDs.PRIME_AIRTIME_GOTV) {
        const data = await this.validateTVInput(receipient);
        result = { ...data, productName: product[0].name, products: data.upgrades };
        delete result["upgrades"];
        return result;
      }
      if(productType === ProductTypes.Electricity) result = await this.validateElectricityInput(receipient, product_id);
    }
    info = { products: product, ...result };
    
    if(product[0]?.hasProductList) {
        const data = await this.getBillPaymentProductList(serviceId, product_id);
        if(data.products.length > 0) info = { ...info,  products: data.products };
    }

    if(product[0].name === "StarTimes") {
      const data = await this.getBillPaymentProductList(serviceId, product_id);
      if(data.products.length > 0) info = { ...info, productName: product[0].name, products: data.products };
    }

    return info;
  }

  public async getBillPaymentInfo(type: ServiceTypes) {
    const url = `${config.primeAirtimeBaseUrl}/billpay/country/NG/${type}`;
    const accessToken = await this.retrieveAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };

    const response = await new HttpClient(url).get<PrimeAirtimeProductResponse>('', headers);
    return response;
  }

  public async getBillPaymentProductList(type: ServiceTypes, productId: string) {
    const url = `${config.primeAirtimeBaseUrl}/billpay/${type}/${productId}`;
    const accessToken = await this.retrieveAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };

    const response = await new HttpClient(url).get<PrimeAirtimeProductResponse>('', headers);
    return response;
  }

  public async validateBettingInput(customerId: string, product_id: string) {
    try {
      const url = `${config.primeAirtimeBaseUrl}/billpay/lottery/validate`;
      const accessToken = await this.retrieveAccessToken();
  
      const headers = { Authorization: `Bearer ${accessToken}` };
      const body = { customerId, product_id };
  
      const response = await new HttpClient(url).post<PrimeAirtimeBettingValidationResponse>('', body, headers);
      return response;
    } catch (error) {
      throw new BadRequestError("Unrecognized Customer")
    }
  }

  public async validateElectricityInput(meterNumber: string, product_id: string) {
    try {
      const url = `${config.primeAirtimeBaseUrl}/billpay/electricity/${product_id}/validate`;
      const accessToken = await this.retrieveAccessToken();
  
      const headers = { Authorization: `Bearer ${accessToken}` };
      const body = { "meter": meterNumber };
  
      const response = await new HttpClient(url).post<PrimeAirtimeElectricityValidationResponse>('', body, headers);
      return response;
    } catch (error) {
      throw new BadRequestError("Invalid Meter Number")
    }
  }

  public async validateTVInput(cardNumber: string) {
    try {
      const url = `${config.primeAirtimeBaseUrl}/billpay/dstvnew/${cardNumber}`;
      const accessToken = await this.retrieveAccessToken(); 
      const headers = { Authorization: `Bearer ${accessToken}` };
  
      const response = await new HttpClient(url).get<PrimeAirtimeTVValidationResponse>('', headers);
      return response;
      
    } catch (error) {
      throw new BadRequestError("Please make sure your operator and Customer ID are correct. Otherwise, please check your account status with your operator.")
    }
  }

  public async executeAirtimeTopUp(order: IOrder, product_id: string, denomination: string, reference: string) {
    try {
      if(product_id === ProductIDs.PRIME_AIRTIME_SMILE_RECHARGE) {
        return await this.executeInternetTopUp(order, denomination.toString(), product_id, reference);
      }

      const productType = order.product.type === ProductTypes.Airtime ? "topup" : "datatopup";
      const url = `${config.primeAirtimeBaseUrl}/${productType}/exec/${order.recipient}`;
      const accessToken = await this.retrieveAccessToken();
      const headers = { Authorization: `Bearer ${accessToken}` };
  
      const body = {
        product_id, denomination,
        customer_reference: reference
      };
  
      const response = await new HttpClient(url).post<PrimeAirtimeExecuteTopUpResponse>('', body, headers);
      return response;
    } catch (error: any) {
      throw Error(error)
    }
  }

  public async executeElectricityTopUp(meterNumber: string, product_id: string, denomination: string, reference: string, prepaid?: boolean) {
    try {
      const url = `${config.primeAirtimeBaseUrl}/billpay/electricity/${meterNumber}`;
      const accessToken = await this.retrieveAccessToken();
      const headers = { Authorization: `Bearer ${accessToken}` };
  
      const body = {
        product_id, denomination, prepaid, 
        customer_reference: reference
      };
  
      const response = await new HttpClient(url).post<PrimeAirtimeExecuteTopUpResponse>('', body, headers);
      return response;
    } catch (error: any) {
      throw Error(error)
    }
  }

  public async executeTVTopUp(order: IOrder, product_id: string, reference: string) {
    try {
      let url: string;
      let body: ExtraMap = { product_id, customer_reference: reference };
      if(product_id === ProductIDs.PRIME_AIRTIME_SHOWMAX)  {
        url = `${config.primeAirtimeBaseUrl}/billpay/showmax`;
        body = { amount: product_id, customer_reference: reference }
      } else {
        url = `${config.primeAirtimeBaseUrl}/billpay/dstvnew/${order.recipient}`;
      }
        
      const accessToken = await this.retrieveAccessToken();
      const headers = { Authorization: `Bearer ${accessToken}` };
  
      const response = await new HttpClient(url).post<PrimeAirtimeExecuteTopUpResponse>('', body, headers);
      return response;
    } catch (error: any) {
      throw Error(error)
    }
  }

  public async executeBettingTopUp(customerID: string, amount: string, product_id: string, reference: string) {
    try {
      const url = `${config.primeAirtimeBaseUrl}/billpay/lottery/${customerID}`;
      const accessToken = await this.retrieveAccessToken();
      const headers = { Authorization: `Bearer ${accessToken}` };
      const body = { product_id, customer_reference: reference, amount };
  
      const response = await new HttpClient(url).post<PrimeAirtimeExecuteTopUpResponse>('', body, headers);
      return response;
    } catch (error: any) {
      throw Error(error)
    }
  }

  public async executeInternetTopUp(order: IOrder, amount: string, product_id: string, reference: string) {
    try {
      const url = `${config.primeAirtimeBaseUrl}/billpay/internet/${product_id}/${amount}`;
      const accessToken = await this.retrieveAccessToken();
      const headers = { Authorization: `Bearer ${accessToken}` };
      const body = { meter: order.recipient, customer_reference: reference };
  
      const response = await new HttpClient(url).post<PrimeAirtimeExecuteTopUpResponse>('', body, headers);
      return response;
    } catch (error: any) {
      throw Error(error)
    }
  }

  private async getAccessToken(): Promise<PrimeAirtimeAccessTokenResponse> {
    const url = `${config.primeAirtimeBaseUrl}/auth`;

    const body = {
      username: config.primeAirtimeUserName,
      password: config.primeAirtimePassword
    };

    const response = await new HttpClient(url).post<PrimeAirtimeAccessTokenResponse>('', body);
    return response;
  }

  private async storeAccessToken(tokenObject: PrimeAirtimeAccessTokenResponse) {
    const expiryDate = new Date(tokenObject.expires);
    const hashedToken = await encode(tokenObject.token);
    await TokenService.storeToken(hashedToken, expiryDate, TokenTypes.PrimeAirtime);
  }

  private async retrieveAccessToken() {
    const response = await TokenService.retrieveToken(TokenTypes.PrimeAirtime);
    if (!response) {
      const tokenObj = await this.getAccessToken();
      await this.storeAccessToken(tokenObj);
      return tokenObj.token;
    }

    const expiryDate = new Date(response.expires);
    if (expiryDate > new Date()) {
      const token = await decode(response.token);
      return token;
    } else {
      const tokenObj = await this.getAccessToken();
      await this.storeAccessToken(tokenObj);
      return tokenObj.token;
    }
  }

  private async refreshAccessToken(token: string): Promise<PrimeAirtimeAccessTokenResponse> {
    const url = `${config.primeAirtimeBaseUrl}/reauth`;

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await new HttpClient(url).get<PrimeAirtimeAccessTokenResponse>('', headers);
    return response;
  }
}




