import mongoose, { Schema, model } from 'mongoose';
import { IPayment, PaymentTypes, PaymentStatus } from '../interfaces/payment.interface';

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
const Payment = model<IPayment>('Payment', paymentSchema);

export default Payment;
