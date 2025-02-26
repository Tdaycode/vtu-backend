import { Schema, model } from 'mongoose';
import { IPaymentMethod, IPaymentMethodDocument, PaymentTypes } from '../interfaces/payment.interface';

const paymentMethodSchema: Schema<IPaymentMethod> = new Schema(
  {
    currencySupported: [{ type: String, min: 1 }],
    name: { type: String, required: true },
    type: { type: String, enum: PaymentTypes, required: true, unique: true },
    isActive: { type: Boolean, required: true, default: true },
  },
  {
    timestamps: true,
  }
); 

// Payment Model
const PaymentMethod = model<IPaymentMethodDocument>('PaymentMethod', paymentMethodSchema); 

export default PaymentMethod;