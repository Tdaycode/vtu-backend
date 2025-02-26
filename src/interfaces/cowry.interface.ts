import { Document, Types } from 'mongoose';

export interface ICowry {
    code: string,
    pin: string,
    value: number,
    isValid: boolean,
    disabled: boolean,
    buyerId: Types.ObjectId,
    loaderId?: Types.ObjectId,
}

export interface CowryTransferData {
    senderUserId: string;
    recipientUsername: string;
    amount: number;
    description?: string;
}

export interface ICowryQuery {
    isValid?: boolean,
    disabled?: boolean,
    page: string;
    limit: string;
    code: string;
}

export interface ICowryDocument extends ICowry, Document {
    isPinMatch: (pin: string) => Promise<boolean>;
}


  