import { IOrder } from './order.interface';
import { IPaymentDocument } from './payment.interface';
import { ProductTypes, ServiceTypes } from './product.interface';
import { IUserDocument } from './user.interface';

export interface IKYCProvider {
  getIdentity(idType: string, number: string, image: string): any;
}

export type ExtraMap = {
  [key: string]: any;
};

export interface IFulfillOrder {
  productType?: string;
  productId: string;
  amount: number;
  order: IOrder;
}

export interface IGetServiceInfo {
  receipient: string;
  productType: ProductTypes;
  serviceId: ServiceTypes;
  product_id: string;
} 

export interface ServiceProvider {
  getAirtimeTopUpInfo(id: string, product_id?: string): any;
  getDataTopUpInfo(id: string): any;
  getBettingInfo(payload: IGetServiceInfo): any;
  getElectricityInfo(payload: IGetServiceInfo): any;
  getTVInfo(payload: IGetServiceInfo): any;
  getInternetInfo(payload: IGetServiceInfo): any;
  getBillPaymentInfo(id: string): any;
  fulfillOrder(payload: IFulfillOrder): any;
}

export interface GiftCardProvider {
  getCatalogAvailability(product_sku: string, price: number): any;
  fulfillOrder(payload: IFulfillOrder): any;
}

export interface ManualProductProvider {
  getManualProductAvailability(): boolean;
  fulfillOrder(payload: IFulfillOrder): any;
}

export interface PaymentProvider {
  generatePaymentLink(payment: IPaymentDocument, user: IUserDocument): any;
  verifyPayment(txID: string): any;
}
