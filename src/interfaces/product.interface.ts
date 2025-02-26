import { Document, ObjectId } from 'mongoose';

export interface IProduct {
    name: string,
    imageUrl: string,
    label: string,
    sid?: string,
    serviceFeeType?: ServiceFeeType,
    serviceFeeAmount?: ServiceFeeAmount,
    description?: string,
    minPrice?: number,
    maxPrice?: number,
    currency: string,
    providers?: Provider[],
    discountType?: DiscountType,
    discountAmount?: DiscountAmount,
    paymentOptions?: PaymentOptions,
    category: ObjectId,
    isAvailable?: boolean,
    allowedPaymentOptions: PaymentTypes[],
    displayCountries: string[],
    type: ProductTypes
}

interface ServiceFeeAmount {
    type: ServiceFeeAmountType,
    value: number
} 

interface Provider {
    name: Providers,
    productId: string,
    serviceId: ServiceTypes
    active: boolean
} 

interface DiscountAmount {
    type: DiscountAmountType,
    value: number
} 

export enum PaymentTypes {
    Adyen = 'adyen',
    BinancePay = 'binance-pay',
    Flutterwave = 'flutterwave',
    Cowry = 'cowry',
}

export enum Providers {
    PrimeAirtime = 'primeairtime',
    Giftly = 'giftly',
    Telebank = 'telebank'
}

export enum ServiceFeeType {
    Global = 'global',
    Specific = 'specific',
}

export enum PaymentOptions {
    Global = 'global',
    Specific = 'specific',
}

export enum ServiceFeeAmountType {
    Percentage = 'percentage',
    Flat = 'flat',
}

export enum DiscountAmountType {
    Percentage = 'percentage',
    Flat = 'flat',
}

export enum ProductTypes {
    Airtime = 'airtime',
    Data = 'data',
    Electricity = 'electricity',
    TV = 'dstv',
    Betting = 'Betting',
    Internet = 'internet',
    Misc = 'misc',
    GiftCard = 'giftcard',
    Cowry = 'cowry',
}

export enum ServiceTypes {
    Electricity = 'electricity',
    TV = 'dstv',
    Lottery = 'lottery',
    Internet = 'internet',
    Misc = 'misc',
    GiftCard = 'giftcard',
    Cowry = 'cowry',
}

export enum DiscountType {
    Global = 'global',
    Specific = 'specific',
}

export enum ElectricityType {
    POSTPAID = 'postpaid',
    PREPAID = 'prepaid',
}

export interface IProductDocument extends IProduct, Document {}

  