import { IPaymentDocument } from './payment.interface';
import { ProductTypes, ServiceTypes } from './product.interface';
import { IUserDocument } from './user.interface';

export interface IKYCProvider {
  getIdentity(idType: string, number: string, image: string): any;
}

export type ExtraMap = {
  [key: string]: any;
};

export interface ServiceProvider {
  getAirtimeTopUpInfo(id: string): any;
  getDataTopUpInfo(id: string): any;
  getBettingInfo(receipient: string, productType: ProductTypes, serviceId: ServiceTypes, product_id: string): any;
  getElectricityInfo(receipient: string, productType: ProductTypes, serviceId: ServiceTypes, product_id: string): any;
  getTVInfo(receipient: string, productType: ProductTypes, serviceId: ServiceTypes, product_id: string): any;
  getInternetInfo(receipient: string, productType: ProductTypes, serviceId: ServiceTypes, product_id: string): any;
  getBillPaymentInfo(id: string): any;
  fulfillOrder(productType: string, productId: string, amount: number, recipient: string, extra?: ExtraMap): any;
}

export interface GiftCardProvider {
  getCatalogAvailability(product_sku: string, price: number): any;
  fulfillOrder(productId: string, amount: number, recipient: string): any;
}

export interface PaymentProvider {
  generatePaymentLink(payment: IPaymentDocument, user: IUserDocument): any;
  verifyPayment(txID: string): any;
}
