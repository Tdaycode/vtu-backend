import { Schema, model } from 'mongoose';
import { IKYCLevel, KYCLevels } from '../interfaces/kyc.interface';

// A Schema corresponding to the document interface.
const KYCLevelSchema: Schema<IKYCLevel> = new Schema(
  {
    level: { type: String, required: true, unique: true, enum: KYCLevels },
    dailyLimit: { type: String, required: true },
    monthlyLimit: { type: String, required: true },
    baseCurrency: { type: String, required: true, default: "USD" }
  },
  {
    timestamps: true,
  },
);

// KYCLevel Model
const KYCLevel = model<IKYCLevel>('KYCLevel', KYCLevelSchema);

export default KYCLevel;
