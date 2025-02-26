import { Document, ObjectId } from 'mongoose';

export interface IPayment {
    orderId: ObjectId,
    userId: ObjectId,
    currency: string,
    txRef: string,
    rate?: string,
    status?: PaymentStatus,
    paymentMethod: PaymentTypes,
    amount: number,
}

export interface IPaymentMethod {
    name: string,
    type: PaymentTypes,
    currencySupported: string[],
    isActive: boolean;
}

export enum PaymentTypes {
    Adyen = 'adyen',
    BinancePay = 'binance-pay',
    Flutterwave = 'flutterwave',
    Cowry = 'cowry',
    Wallet = 'wallet',
}

export enum PaymentStatus {
    Pending = 'pending',
    Successful = 'successful',
    Failed = 'failed',
    Refunded = 'refunded',
}

export interface IPaymentQuery {
    status?: PaymentStatus,
    paymentMethod?: PaymentTypes,
    page: string;
    limit: string;
}




export interface IPaymentDocument extends IPayment, Document {};
export interface IPaymentMethodDocument extends IPaymentMethod, Document {};

  