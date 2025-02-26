import OTP from '../models/otp.model';
import { Service } from 'typedi';
import { IOtpDocument } from '../interfaces/otp.interface';

@Service()
export default class OTPRepository {
  createOTP = async (otp: string, date: Date): Promise<IOtpDocument> => {
    const user = new OTP({
      otp,
      expires: date,
    });
    return await user.save();
  };

  findOne = async (id: string): Promise<IOtpDocument | null> => {
    return await OTP.findOne({ _id: id });
  };

  deleteOne = async (id: string): Promise<IOtpDocument | null> => {
    return await OTP.remove({ _id: id });
  };
}
