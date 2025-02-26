import moment from 'moment';
import { uuid } from 'uuidv4';
import { HttpClient } from '../utils/http-client.util';
import config from '../config/Config';
import { Service } from 'typedi';
import TokenService from '../services/token.service';
import { TokenTypes } from '../interfaces/token.interface';
import { encode, decode } from '../utils/crypto';
import { BadRequestError } from '../utils/ApiError';
import { CreateStaticVirtualAccount, RetrieveVirtualAcoountBalance, WithdrawalVirtualAccount } from '../interfaces/responses/kuda.response.interface';
import { IUserDocument } from '../interfaces/user.interface';

@Service()
export class KudaProvider {
  public async retrieveVirtualAccountBalance(userId: string) {
    const url = config.kudaBaseUrl;
    const accessToken = await this.retrieveAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };

    const body = {
      "servicetype": "RETRIEVE_VIRTUAL_ACCOUNT_BALANCE",
      "requestref": uuid(),
      "data": {
        "trackingReference": userId
      }
    }

    const response = await new HttpClient(url).post<RetrieveVirtualAcoountBalance>('', body, headers);
    return response.data;
  }

  public async withdrawalfromVirtualAccount(userId: string, amount: number) {
    const url = config.kudaBaseUrl;
    const accessToken = await this.retrieveAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };

    const body = {
      "servicetype": "WITHDRAW_VIRTUAL_ACCOUNT",
      "requestref": uuid(),
      "data": {
        "trackingReference": userId,
        amount, narration: "Withdrawal",
        "ClientFeeCharge": 0
      }
    }

    const response = await new HttpClient(url).post<WithdrawalVirtualAccount>('', body, headers);
    if(!response.status) throw new BadRequestError(response.message)
    return response;
  }

  public async fundVirtualAccount(userId: string, amount: number) {
    const url = config.kudaBaseUrl;
    const accessToken = await this.retrieveAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };

    const body = {
      "servicetype": "FUND_VIRTUAL_ACCOUNT",
      "requestref": uuid(),
      "data": {
        "trackingReference": userId,
        amount, narration: "Credit",
      }
    }

    const response = await new HttpClient(url).post<WithdrawalVirtualAccount>('', body, headers);
    if(!response.status) throw new BadRequestError(response.message)
    return response;
  }

  public async createStaticVirtualAccount(user: IUserDocument) {
    const url = config.kudaBaseUrl;
    const accessToken = await this.retrieveAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };
    const phone = user.phoneNumber.replace(/^\+234/, '0');

    const body = {
      "ServiceType": "ADMIN_CREATE_VIRTUAL_ACCOUNT",
      "RequestRef": uuid(),
      "Data": {
        "email": user.email,
        "phoneNumber": phone,
        "lastName": user.lastName,
        "firstName": user.lastName,
        "trackingReference": user._id.toString()
      }
    };

    const response = await new HttpClient(url).post<CreateStaticVirtualAccount>('', body, headers);
    if(!response.status) throw new BadRequestError("Unable to create static virtual account");
    return { bankName: "Kuda Bank", accountNumber: response.data.accountNumber };
  }

  private async getAccessToken(): Promise<string> {
    try {
      const url = `${config.kudaBaseUrl}/Account/GetToken`;

      const body = {
        email: config.kudaEmail,
        apiKey: config.kudaAPIKey
      };

      const response = await new HttpClient(url).post<string>('', body);
      return response;
    } catch (error) {
      throw new BadRequestError("error")
    }
  }

  private async storeAccessToken(token: string) {
    const expiryDate = (moment().add(14, "minutes")).toDate();
    const hashedToken = await encode(token);
    await TokenService.storeToken(hashedToken, expiryDate, TokenTypes.Kuda);
  }

  private async retrieveAccessToken() {
    const response = await TokenService.retrieveToken(TokenTypes.Kuda);
    if (!response) {
      const token = await this.getAccessToken();
      await this.storeAccessToken(token);
      return token;
    }

    const expiryDate = new Date(response.expires);
    if (expiryDate > new Date()) {
      const token = await decode(response.token);
      return token;
    } else {
      const token = await this.getAccessToken();
      await this.storeAccessToken(token);
      return token;
    }
  }
}