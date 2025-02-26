import { Document, ObjectId } from 'mongoose';
import { Providers, ElectricityType, PaymentTypes } from './product.interface';

export interface IOrder {
    orderNumber: string,
    reference?: string,
    orderStatusMessage?: string,
    currency: string,
    status?: OrderStatus,
    userId: ObjectId,
    paymentId?: ObjectId,
    prepaid?: boolean,
    product: Product,
    amount: number,
    amountUSD: number,
    recipient: string,
    additionalInfo?: AdditionInfo,
    discount?: number,
    serviceFee?: number,
    subTotal: number,
    total: number
}

export interface AdditionInfo {
    [key: string]: string | number;
}

export interface Product {
    id: ObjectId,
    externalId: string,
    name: string,
    provider: Providers,
    type: string,
    amount: number
}

export enum OrderStatus {
    Pending = 'pending',
    Successful = 'successful',
    Failed = 'failed',
}
export interface IOrderDocument extends IOrder, Document {}

export interface IOrderSummaryRequest {
    productID: ObjectId,
    product_id: string,
    amount: number,
    recipient: string,
    country: string,
    electricityType?: ElectricityType
}

export interface IOrderRequest extends IOrderSummaryRequest {
    paymentMethod: PaymentTypes,
    userId: ObjectId,
    pin?: string
}

  