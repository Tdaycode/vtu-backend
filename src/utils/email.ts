// import sgMail from '@sendgrid/mail';
// import config from '../config/Config';
// sgMail.setApiKey(config.sendGridAPIKey);

// const sendEmail = async (data: any) => {
//   const { subject, email, html } = data;
//   try {
//     await sgMail.send({
//       to: email,
//       from: config.emailSender,
//       subject,
//       html,
//     });
//   } catch (error) {
//     console.error(error);
//   }
// };

// export default sendEmail;

import nodemailer from 'nodemailer';
import config from '../config/Config';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.gmailUser, // Your Gmail address
    pass: config.gmailPassword, // Your Gmail app password
  },
});

const sendEmail = async (data: any) => {
  const { subject, email, html } = data;
  try {
    await transporter.sendMail({
      from: config.emailSender, // Sender email
      to: email, // Recipient email
      subject, // Email subject
      html, // Email content
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export default sendEmail;
