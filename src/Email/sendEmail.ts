import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const sendEmail = async (to: string, subject: string, content: string): Promise<void> => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER as string, // Load from .env
        pass: process.env.EMAIL_PASS as string, // Load from .env
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender's email
      to, // Recipient email
      subject, // Email subject
      text: content, // Email body (text format)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
  } catch (error: any) {
    console.error('Error sending email:', error.message);
  }
};
