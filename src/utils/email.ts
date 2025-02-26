import sgMail from '@sendgrid/mail';
import config from '../config/Config';
sgMail.setApiKey(config.sendGridAPIKey);

const sendEmail = async (data: any) => {
  const { subject, email, html } = data;
  try {
    await sgMail.send({
      to: email,
      from: config.emailSender,
      subject,
      html,
    });
  } catch (error) {
    console.error(error);
  }
};

export default sendEmail;
