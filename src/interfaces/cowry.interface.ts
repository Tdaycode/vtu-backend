import { Document } from 'mongoose';

export interface ICowry {
    code: string,
    pin: string,
    value: number,
    isValid: boolean,
}

export interface CowryTransferData {
    senderUserId: string;
    recipientUsername: string;
    amount: number;
    description?: string;
}

export interface ICowryDocument extends ICowry, Document {
    isPinMatch: (pin: string) => Promise<boolean>;
}


  