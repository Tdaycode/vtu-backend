import { Schema, model } from 'mongoose';
import { ICurrency } from '../interfaces/currency.interface';

// A Schema corresponding to the document interface.
const CurrencySchema: Schema<ICurrency> = new Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
    expires: { type: Date },
    symbol: { type: String, required: true },
    base: { type: String, required: true, default: "USD" },
    rate: { type: Number, required: true },
    status: { type: String, default: "active" },
    default: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
); 

// Currency Schema Model
const Currency = model<ICurrency>('Currency', CurrencySchema);

export default Currency;
