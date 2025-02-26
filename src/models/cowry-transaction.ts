import mongoose, { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { ICowryTransaction, ICowryTransactionDocument, TransactionStatus, Transactiontype } from '../interfaces/cowry-transaction.interface';

// A Schema corresponding to the document interface.
const cowryTransactionSchema: Schema<ICowryTransaction> = new Schema(
  {
    sender: { type: String, required: true },
    description: { type: String },
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
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
    amount: { type: Number, required: true }
  },
  {
    timestamps: true,
  }
);

cowryTransactionSchema.plugin(mongoosePaginate);

// CowryTransaction Model
const CowryTransaction = model<ICowryTransaction>('CowryTransaction', cowryTransactionSchema); 

// create the paginated model
const PaginatedCowryTransaction = model<ICowryTransactionDocument,
  mongoose.PaginateModel<ICowryTransactionDocument>
>('CowryTransaction', cowryTransactionSchema, 'cowrytransactions');

export { CowryTransaction, PaginatedCowryTransaction }; 
