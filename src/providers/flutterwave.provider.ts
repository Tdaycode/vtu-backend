import { PaymentProvider } from '../interfaces/provider.interface';
import { HttpClient } from '../utils/http-client.util';
import config from '../config/Config';
import { Service } from 'typedi';
import { FlutterwavePaymentResponse, FlutterwaveVerifyTransactionResponse } from '../interfaces/responses/flutterwave.response.interface';
import { IPaymentDocument } from '../interfaces/payment.interface';
import { IUserDocument } from '../interfaces/user.interface';

@Service()
export class FlutterwaveProvider implements PaymentProvider {

  public async generatePaymentLink(payment: IPaymentDocument, user: IUserDocument): Promise<string> {
    const url = `${config.flutterwaveBaseUrl}/payments`;
    const accessToken = config.flutterwaveSecret;
    const headers = { Authorization: `Bearer ${accessToken}` };

    const body = {
      tx_ref: payment.txRef,
      currency: payment.currency,
      amount: (payment.amount).toString(),
      redirect_url: config.flutterwaveRedirectUrl,
      meta: {
        paymentId: (payment._id).toString(),
        orderId: (payment.orderId).toString(),
      },
      customer: {
        email: user.email,
        name: user.firstName + " " + user.lastName
      },
    };

    const response = await new HttpClient(url).post<FlutterwavePaymentResponse>('', body, headers);
    return response.data.link;
  }

  public async verifyPayment(txID: string) {
    const url = `${config.flutterwaveBaseUrl}/transactions/${txID}/verify`;
    const accessToken = config.flutterwaveSecret;
    const headers = { Authorization: `Bearer ${accessToken}` };

    const response = await new HttpClient(url).get<FlutterwaveVerifyTransactionResponse>('', headers);
    return response.data;
  }
}




