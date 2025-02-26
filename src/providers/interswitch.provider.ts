import { ExtraMap, IFulfillOrder, IGetServiceInfo, ServiceProvider } from '../interfaces/provider.interface';
import { HttpClient } from '../utils/http-client.util';
import { uuid } from 'uuidv4';
import Big from 'big.js';
import config from '../config/Config';
import { Service } from 'typedi';
import TokenService from '../services/token.service';
import { TokenTypes } from '../interfaces/token.interface';
import { encode, decode } from '../utils/crypto';
import { BadRequestError } from '../utils/ApiError';
import { OrderStatus } from '../interfaces/order.interface';
import { InterswitchAccessTokenResponse, InterswitchCustomerValidationResponse, 
  InterswitchGetPaymentItemResponse, 
  InterswitchTransactionResponse } from '../interfaces/responses/interswitch.response.interface';
import moment from 'moment';

@Service()
export class InterSwitchProvider implements ServiceProvider {

  public async fulfillOrder(payload: IFulfillOrder) {
    try {
      const { productId, amount, order } = payload;
      const reference = uuid();
      let response: InterswitchTransactionResponse, data: ExtraMap = {};
      const paymentItem = await this.getPaymentItem(productId);
      const paymentCode = paymentItem.PaymentItems[0].PaymentCode;
      response = await this.createTransaction(order.recipient, amount.toString(), paymentCode, reference);
  
      let orderStatus = "";
  
      if (response.ResponseCodeGrouping === "SUCCESSFUL") {
        orderStatus = OrderStatus.Successful
      } else if (response.ResponseCodeGrouping === "PENDING") {
        orderStatus = OrderStatus.Pending
      } else {
        orderStatus = OrderStatus.Failed
      }
  
      return { reference: response.TransactionRef, data, orderStatusMessage: response.ResponseDescription, orderStatus };
    } catch (error: any) {
      throw new Error(error)
    }
  }

  public async getBettingInfo(payload: IGetServiceInfo) {
    const { receipient, product_id } = payload;
    const paymentItem = await this.getPaymentItem(product_id);
    const paymentCode = paymentItem.PaymentItems[0].PaymentCode;
    const response = await this.validateCustomer(receipient, paymentCode);
    return response;
  }

  public async getPaymentItem(product_id: string) {
    try {
      const url = `${config.interswitchBaseUrl}/quicktellerservice/api/v5/services/options?serviceid=${product_id}`;
      const accessToken = await this.retrieveAccessToken();

      const headers = { Authorization: `Bearer ${accessToken}`, terminalId: config.interswitchTerminalID };
      const response = await new HttpClient(url).get<InterswitchGetPaymentItemResponse>('', headers);
      if(response.ResponseCodeGrouping !== "SUCCESSFUL") throw Error("Unrecognized Customer");
      return response;
    } catch (error) {
      throw new BadRequestError("Unrecognized Customer")
    }
  }

  public async validateCustomer(customerId: string, product_id: string) {
    try {
      const url = `${config.interswitchBaseUrl}/quicktellerservice/api/v5/Transactions/validatecustomers`;
      const accessToken = await this.retrieveAccessToken();

      const headers = { Authorization: `Bearer ${accessToken}` };
      const body = {
        customers: [
          {
            "PaymentCode": product_id,
            "CustomerId": customerId,
          }
        ],
        TerminalId: config.interswitchTerminalID
      };

      const response = await new HttpClient(url).post<InterswitchCustomerValidationResponse>('', body, headers);
      if(response.ResponseCodeGrouping !== "SUCCESSFUL"
      || response.Customers[0].ResponseCode !== "90000"
      ) throw Error("Unrecognized Customer");
      return response;
    } catch (error) {
      throw new BadRequestError("Unrecognized Customer")
    }
  }

  private async createTransaction(recipient: string, amount: string, product_id: string, reference: string) {
    try {
      const url = `${config.interswitchBaseUrl}/quicktellerservice/api/v5/Transactions`;
      const accessToken = await this.retrieveAccessToken();
      const headers = { Authorization: `Bearer ${accessToken}`, terminalId: config.interswitchTerminalID };
      const body = {        
        PaymentCode: product_id,
        CustomerId: recipient,
        CustomerEmail: config.interswitchCustomerEmail,
        CustomerMobile: config.interswitchCustomerMobile,
        Amount: (Big(amount).times(100)).toString(),
        requestReference: `${config.interswitchRequestPrefix}-${reference}`
      }; 

      const response = await new HttpClient(url).post<InterswitchTransactionResponse>('', body, headers);
      return response;
    } catch (error: any) {
      throw Error(error)
    }
  }

  private async getAccessToken(): Promise<InterswitchAccessTokenResponse> {
    const url = `${config.interswitchPassportBaseUrl}/passport/oauth/token`;

    const clientId = config.interswitchClientID;
    const secretKey = config.interswitchSecretKey;
    const encodedCredentials = await this.base64EncodeCredentials(clientId, secretKey);

    const data = {
      grant_type: "client_credentials",
      scope: "profile",
    };

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${encodedCredentials}`
    };

    const body = new URLSearchParams(data).toString();
    const response = await new HttpClient(url).post<InterswitchAccessTokenResponse>('', body, headers);
    return response;
  }

  private async base64EncodeCredentials(clientId: string, secretKey: string) {
    const credentials = `${clientId}:${secretKey}`;
    const encodedCredentials = Buffer.from(credentials).toString('base64');
    return encodedCredentials;
  }

  private async storeAccessToken(tokenObject: InterswitchAccessTokenResponse) {
    const expiryDate = (moment().add(tokenObject.expires_in, 'seconds')).toDate();
    const hashedToken = await encode(tokenObject.access_token);
    await TokenService.storeToken(hashedToken, expiryDate, TokenTypes.Interswitch);
  }

  private async retrieveAccessToken() {
    const response = await TokenService.retrieveToken(TokenTypes.Interswitch);
    if (!response) {
      const tokenObj = await this.getAccessToken();
      await this.storeAccessToken(tokenObj);
      return tokenObj.access_token;
    }

    const expiryDate = new Date(response.expires);
    if (expiryDate > new Date()) {
      const token = await decode(response.token);
      return token;
    } else {
      const tokenObj = await this.getAccessToken();
      await this.storeAccessToken(tokenObj);
      return tokenObj.access_token;
    }
  }

  public async getAirtimeTopUpInfo(phoneNumber: string, product_id: string) {
    const response = await this.validateCustomer(phoneNumber, product_id);
    return response;
  };

  public async getElectricityInfo(payload: IGetServiceInfo)  {
    const { receipient, product_id } = payload;
    const paymentItem = await this.getPaymentItem(product_id);
    const paymentCode = paymentItem.PaymentItems[0].PaymentCode;
    const response = await this.validateCustomer(receipient, paymentCode);
    return response;
  };

  public getDataTopUpInfo() { throw new Error("Not Supported") };
  public getTVInfo() { throw new Error("Not Supported") };
  public getInternetInfo() { throw new Error("Not Supported") };
  public getBillPaymentInfo() { throw new Error("Not Supported") };
}




