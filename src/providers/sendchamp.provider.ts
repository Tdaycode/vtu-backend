import { HttpClient } from '../utils/http-client.util';
import config from '../config/Config';
import { Service } from 'typedi';
import { BadRequestError } from '../utils/ApiError';
import { SendVERIFICATIONOTPResponse } from '../interfaces/responses/sendchamp.response.interface';

@Service()
export class SendChampProvider {
  public async sendOTP(phoneNumber: string, otp: string) {
    const url = `${config.sendchampBaseUrl}/verification/create`;
    const accessToken = config.sendchampPublicKey;
    const headers = { Authorization: `Bearer ${accessToken}` };

    const body = {
      channel: "sms",
      sender: "DAlert",
      token_type: "numeric",
      token_length: 6,
      expiration_time: 10,
      token: otp,
      customer_mobile_number: phoneNumber
    };

    const response = await new HttpClient(url).post<SendVERIFICATIONOTPResponse>('', body, headers);
    if(response.status !== 'success') throw new BadRequestError("Unable to send OTP");
    return response.data;
  }
}