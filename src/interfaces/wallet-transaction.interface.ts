import { Document, ObjectId } from 'mongoose';

export interface IWalletTransaction {
    userId: ObjectId,
    description?: string,
    reference: string,
    amount: number,
    openingBalance: number,
    balanceAfter: number,
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

export interface IWalletTransactionDocument extends IWalletTransaction, Document {}

  