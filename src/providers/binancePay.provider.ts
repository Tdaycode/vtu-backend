import { HttpClient } from '../utils/http-client.util';
import config from '../config/Config';
import { Service } from 'typedi';
import forge from 'node-forge';
import crypto from 'crypto';
import { IPaymentDocument } from '../interfaces/payment.interface';
import { IUserDocument } from '../interfaces/user.interface';
import { BinancePayCertificateResponse, BinancePayResponse, BinancePayStatusResponse, BinanceWebhookCertificate } from '../interfaces/responses/binancePay.response.interface';
import { IProductDocument } from '../interfaces/product.interface';

@Service()
export class BinancePayProvider {

  public async generatePaymentLink(payment: IPaymentDocument, user: IUserDocument, product: IProductDocument): Promise<string> {
    const url = `${config.binancePayBaseUrl}/binancepay/openapi/v2/order`;

    const body = {
      env: {
        terminalType: 'WEB',
      },
      merchantTradeNo: (payment._id).toString(),
      orderAmount: Number(payment.amount),
      currency: 'USDT',
      goods: {
        goodsType: '02',
        goodsCategory: '6000',
        referenceGoodsId: (payment.orderId).toString(),
        goodsName: product.name
      },
      buyer: {
        buyerName: {
          firstName: user.firstName,
          lastName: user.lastName
        },
        buyerEmail: user.email
      },
      returnUrl: config.flutterwaveRedirectUrl,
      cancelUrl: config.flutterwaveRedirectUrl,
      webhookUrl: config.binancePayWebhookUrl
    };

    console.log(body)

    const headers = this.generateBinancePayHeaders(body);
    const response = await new HttpClient(url).post<BinancePayResponse>('', body, headers);
    return response.data.universalUrl;
  }

  public async verifyBinancePaySignature(headers: any, body: string): Promise<boolean> {
    const payload = `${headers['binancepay-timestamp']}\n${headers['binancepay-nonce']}\n${JSON.stringify(body)}\n`;

    const decodedSignatureBuffer = Buffer.from(headers['binancepay-signature'], 'base64');
    const decodedSignature = decodedSignatureBuffer.toString('binary');

    const verifier = crypto.createVerify('RSA-SHA256');
    verifier.update(payload);

    const publicKey = await this.getBinancePublicKey();  
    const status =  verifier.verify(publicKey, decodedSignature);
    console.log(status)
    return status;
  }

  public async verifyBinancePaySignaturej(headers: any, body: string): Promise<boolean> {
    console.log(body)

    const payload = `${headers['binancepay-timestamp']}\n${headers['binancepay-nonce']}\n${body}\n`;
    console.log("payload", payload)

    const publicKey = await this.getBinancePublicKey();  
    console.log("publicKey", publicKey)

    var pki = forge.pki;


    const pubParser = forge.pki.pem.decode(publicKey);
    const pubKeyObj = forge.pki.publicKeyFromAsn1(pubParser.body);
    const pubKey = forge.pki.rsa.setPublicKey(pubKeyObj);

    const payloadBytes = forge.util.encodeUtf8(payload);

    // Initialize verifier with SHA-256 digest
    const verifier = forge.pki.rsa.createVerifier('SHA256');
    verifier.setPublicKey(pubKey);
  
    // Update verifier with payload bytes
    verifier.update(payloadBytes);


    const decodedSignature = Buffer.from(headers['binancepay-signature'], 'base64');
    console.log("decodedSignature", decodedSignature)

    const status =  verifier.verify(decodedSignature);
    console.log(status)
    return status;
  }
  
  public async verifyPayment(paymentId: string) {
    const url = `${config.binancePayBaseUrl}/binancepay/openapi/v2/order/query`;

    const body = {
      "merchantTradeNo": paymentId
    }

    const headers = this.generateBinancePayHeaders(body);
    const response = await new HttpClient(url).post<BinancePayStatusResponse>('', body, headers);
    return response;
  }

  private generateBinancePayHeaders(payload: { [key: string]: any } ) {
    const timestamp = Date.now(); // Generate current timestamp in seconds
    const nonce = crypto.randomBytes(16).toString('hex'); // Generate a random nonce
    const signaturePayload = `${timestamp}\n${nonce}\n${JSON.stringify(payload)}\n`;

    const hmac = crypto.createHmac('sha512', config.binancePaySecret);
    const signature = hmac.update(signaturePayload).digest('hex').toUpperCase();

    const headers = {
      "BinancePay-Timestamp": timestamp,
      "BinancePay-Nonce": nonce,
      "BinancePay-Signature": signature.toUpperCase(),
      "BinancePay-Certificate-SN": config.binancePayAPIKey
    };

    return headers;
  }

  public async getBinancePublicKey() {
    const headers = this.generateBinancePayHeaders({});
    const url = `${config.binancePayBaseUrl}/binancepay/openapi/certificates`;
    const response = await new HttpClient(url).post<BinancePayCertificateResponse>('', {}, headers);
    return response.data[0]?.certPublic;
  }
}




