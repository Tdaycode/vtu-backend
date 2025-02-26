import { Schema, model } from 'mongoose';
import { IOtp } from '../interfaces/otp.interface';

// A Schema corresponding to the document interface.
const otpSchema: Schema<IOtp> = new Schema(
  {
    otp: { type: String, required: true },
    expires: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// OTP Model
const OTP = model<IOtp>('OTP', otpSchema);

export default OTP;
