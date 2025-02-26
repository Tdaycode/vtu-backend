import { Document, ObjectId } from 'mongoose';

export interface ICowryTransaction {
    userId: ObjectId,
    sender: string,
    description?: string,
    amount: number,
    type: Transactiontype,
    status: TransactionStatus,
}

export enum TransactionStatus {
    Pending = 'pending',
    Successful = 'successful',
    Failed = 'failed',
}
export enum Transactiontype {
    Credit = 'credit',
    Debit = 'debit'
}

export interface ICowryTransactionDocument extends ICowryTransaction, Document {}

  