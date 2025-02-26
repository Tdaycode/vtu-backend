import { Document, ObjectId } from 'mongoose';

export interface IPayment {
    orderId: ObjectId,
    userId: ObjectId,
    currency: string,
    txRef: string,
    status?: PaymentStatus,
    paymentMethod: PaymentTypes,
    amount: number
}

export enum PaymentTypes {
    Adyen = 'adyen',
    BinancePay = 'binance-pay',
    Flutterwave = 'flutterwave',
    Cowry = 'cowry',
}

export enum PaymentStatus {
    Pending = 'pending',
    Successful = 'successful',
    Failed = 'failed',
}
export interface IPaymentDocument extends IPayment, Document {}

  