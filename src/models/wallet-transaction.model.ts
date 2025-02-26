import mongoose, { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { IWalletTransaction, IWalletTransactionDocument, TransactionStatus, Transactiontype } from '../interfaces/wallet-transaction.interface';

// A Schema corresponding to the document interface.
const walletTransactionSchema: Schema<IWalletTransaction> = new Schema(
  {
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    description: { type: String },
    reference: { type: String },
    status: {
        type: String,
        enum: TransactionStatus,
        default: TransactionStatus.Pending
    },
    type: {
        type: String,
        enum: Transactiontype,
        required: true
    },
    amount: { type: Number, required: true },
    openingBalance: { type: Number, required: true },
    balanceAfter: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

walletTransactionSchema.plugin(mongoosePaginate);


// WalletTransaction Model
const WalletTransaction = model<IWalletTransactionDocument>('WalletTransaction', walletTransactionSchema); 

// create the paginated model
const PaginatedWalletTransaction = model<IWalletTransactionDocument,
  mongoose.PaginateModel<IWalletTransactionDocument>
>('WalletTransaction', walletTransactionSchema, 'wallettransactions'); 

export { WalletTransaction, PaginatedWalletTransaction }; 
