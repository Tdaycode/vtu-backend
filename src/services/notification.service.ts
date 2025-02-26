import { Service } from 'typedi';
import mjmlUtils from 'mjml-utils';
import path from 'path';

import { BadRequestError } from '../utils/ApiError';
import { LoggerClient } from './logger.service';
import sendEmail from '../utils/email';

const htmlVerificationEmail = path.join(__dirname, '../templates/email-verification/email-verification.html');
const htmlForgotPasswordEmail = path.join(__dirname, '../templates/forgot-password/forgot-password.html');
const htmlBillPaymentSuccessEmail = path.join(__dirname, '../templates/bill-payment-successful/index.html');
const htmlGiftCardPaymentSuccessEmail = path.join(__dirname, '../templates/giftcard-payment-successful/index.html');
const htmlTwoFaAuthenticationEmail = path.join(
  __dirname,
  '../templates/two-fa-authentication/two-fa-authentication.html',
);

@Service()
export default class NotificationService {
  constructor(public logger: LoggerClient) {}

  public sendEmailVerificationEmail = async (name: string, code: string, email: string) => {
    try {
      const contentHtml = await mjmlUtils.inject(htmlVerificationEmail, { name, email, code });
      const _data = await sendEmail({
        subject: 'Verify your GiftCop Account',
        email,
        html: contentHtml,
      });
      return _data;
    } catch (error) {
      this.logger.error('Unable to send email');
      throw new BadRequestError('Unable to send email');
    }
  };

  public sendtwoFAEmail = async (name: string, code: string, email: string) => {
    try {
      const contentHtml = await mjmlUtils.inject(htmlTwoFaAuthenticationEmail, { name, email, code });
      const _data = await sendEmail({
        subject: 'Two Factor Authentication',
        email,
        html: contentHtml,
      });
      return _data;
    } catch (error) {
      this.logger.error('Unable to send email');
      throw new BadRequestError('Unable to send email');
    }
  };

  public sendForgotPasswordEmail = async (name: string, code: string, email: string) => {
    try {
      const contentHtml = await mjmlUtils.inject(htmlForgotPasswordEmail, { name, email, code });
      const _data = await sendEmail({
        subject: 'Forgot Password - Reset Your Gift Cop Password',
        email,
        html: contentHtml,
      });
      return _data;
    } catch (error) {
      this.logger.error('Unable to send email');
      throw new BadRequestError('Unable to send email');
    }
  };

  public sendBillPaymentSuccessEmail = async (data: any) => {
    const { currency, amount, name, txRef, recipient, type, paymentMethod, date, email } = data;
    try {
      const contentHtml = await mjmlUtils.inject(htmlBillPaymentSuccessEmail, {  currency, amount, name, txRef, recipient, type, paymentMethod, date });
      const _data = await sendEmail({
        subject: 'Bill Payment Successful',
        email,
        html: contentHtml,
      });
      return _data; 
    } catch (error) {
      this.logger.error('Unable to send email');
      throw new BadRequestError('Unable to send email');
    }
  };

  public sendGiftcardPaymentSuccessEmail = async (data: any) => {
    const { currency, amount, name, txRef, recipient, type, paymentMethod, date, email, cardSerialNumber, cardPIN, claimLink } = data;
    try {
      const contentHtml = await mjmlUtils.inject(htmlGiftCardPaymentSuccessEmail, {  currency, amount, name, txRef, recipient, 
        type, paymentMethod, date, cardSerialNumber, cardPIN, claimLink });
      const _data = await sendEmail({
        subject: 'Gift Card Purchase Successful',
        email,
        html: contentHtml,
      });
      return _data; 
    } catch (error) {
      this.logger.error('Unable to send email');
      throw new BadRequestError('Unable to send email');
    }
  };
}
