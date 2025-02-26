import mongoose, { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { IPayment, PaymentTypes, PaymentStatus, IPaymentDocument } from '../interfaces/payment.interface';

// A Schema corresponding to the document interface.
const paymentSchema: Schema<IPayment> = new Schema(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    }, 
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true
    },
    currency: { type: String, default: "NGN" },
    txRef: { type: String, required: true },
    rate: { type: String },
    paymentMethod: { type: String, enum: PaymentTypes, required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: PaymentStatus,
      default: PaymentStatus.Pending
    }
  },
  {
    timestamps: true,
  }
);

// Payment Model
paymentSchema.plugin(mongoosePaginate);

const Payment = model<IPayment>('Payment', paymentSchema);

const PaginatedPayment = model<IPaymentDocument,
  mongoose.PaginateModel<IPaymentDocument>
>('Payment', paymentSchema, 'payments'); 

export { PaginatedPayment, Payment };