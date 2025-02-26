import { Document } from 'mongoose';

export interface ICurrency extends Document {
    default: boolean;
    name: string;
    symbol: string;
    expires: Date;
    code: string;
    base: string;
    rate: number;
    status: string;
} 

export enum ICurrencyTypes {
    Naira = 'NGN',
    US_DOLLARS = 'USD',
    COWRY = 'COY'
}

export interface ICurrencyDocument extends ICurrency, Document { }

