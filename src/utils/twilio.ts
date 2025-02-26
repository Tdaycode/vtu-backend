import twilio from "twilio";
import config from '../config/Config';
const client = twilio(config.twilioSID, config.twilioToken);
const twillioVerify = client.verify.v2.services(config.twilioVerifySID);

export async function initatePhoneVerification(phoneNumber: string) {
  try {
    const response = await twillioVerify.verifications
      .create({ to: phoneNumber, channel: "sms" });
    return response;
  } catch (error) {
    throw Error("Error Initiating Phone Verification");
  }
} 

export async function verifyCode(phoneNumber: string, otp: string) {
  try {
    const response = await twillioVerify.verificationChecks.
      create({ to: phoneNumber, code: otp });
    if(!response.valid) throw Error("Retry again code expired")
    return response;
  } catch (err) {
    throw Error("Retry again code expired")
  }
}