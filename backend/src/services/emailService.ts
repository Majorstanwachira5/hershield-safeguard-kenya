import nodemailer from 'nodemailer';
import { logger } from '../utils/logger';

interface EmailOptions {
  to: string;
  subject: string;
  template: string;
  data: any;
}

// Create transporter
const createTransporter = () => {
  if (process.env.NODE_ENV === 'development') {
    // For development, you can use services like Ethereal for testing
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'ethereal.user@ethereal.email',
        pass: 'ethereal.pass'
      }
    });
  } else {
    // Production email configuration
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
      }
    });
  }
};

// Email templates
const getEmailTemplate = (template: string, data: any): { html: string; text: string } => {
  switch (template) {
    case 'verification':
      return {
        html: `
          <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to HerShield</h1>
              <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">Your Digital Safety Platform</p>
            </div>
            <div style="padding: 40px 20px; background: #ffffff;">
              <h2 style="color: #333; font-size: 24px; margin-bottom: 20px;">Hi ${data.firstName}!</h2>
              <p style="color: #666; font-size: 16px; margin-bottom: 30px;">
                Thank you for joining HerShield. We're excited to help you stay safe online. 
                To get started, please verify your email address by clicking the button below.
              </p>
              <div style="text-align: center; margin: 40px 0;">
                <a href="${data.verificationUrl}" 
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                          color: white; 
                          text-decoration: none; 
                          padding: 15px 30px; 
                          border-radius: 5px; 
                          font-weight: bold; 
                          display: inline-block; 
                          font-size: 16px;">
                  Verify Email Address
                </a>
              </div>
              <p style="color: #666; font-size: 14px; margin-top: 30px;">
                If you can't click the button, copy and paste this link into your browser:<br>
                <a href="${data.verificationUrl}" style="color: #667eea;">${data.verificationUrl}</a>
              </p>
              <p style="color: #666; font-size: 14px; margin-top: 30px;">
                This link will expire in 24 hours for security reasons.
              </p>
            </div>
            <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px;">
              <p>If you didn't create an account with HerShield, please ignore this email.</p>
              <p>&copy; 2024 HerShield. Protecting women's digital rights.</p>
            </div>
          </div>
        `,
        text: `
Welcome to HerShield!

Hi ${data.firstName},

Thank you for joining HerShield. We're excited to help you stay safe online.

To get started, please verify your email address by visiting this link:
${data.verificationUrl}

This link will expire in 24 hours for security reasons.

If you didn't create an account with HerShield, please ignore this email.

© 2024 HerShield. Protecting women's digital rights.
        `
      };

    case 'password-reset':
      return {
        html: `
          <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Password Reset</h1>
              <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">HerShield Security</p>
            </div>
            <div style="padding: 40px 20px; background: #ffffff;">
              <h2 style="color: #333; font-size: 24px; margin-bottom: 20px;">Hi ${data.firstName},</h2>
              <p style="color: #666; font-size: 16px; margin-bottom: 30px;">
                You requested to reset your password. Click the button below to create a new password.
              </p>
              <div style="text-align: center; margin: 40px 0;">
                <a href="${data.resetUrl}" 
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                          color: white; 
                          text-decoration: none; 
                          padding: 15px 30px; 
                          border-radius: 5px; 
                          font-weight: bold; 
                          display: inline-block; 
                          font-size: 16px;">
                  Reset Password
                </a>
              </div>
              <p style="color: #666; font-size: 14px; margin-top: 30px;">
                If you can't click the button, copy and paste this link into your browser:<br>
                <a href="${data.resetUrl}" style="color: #667eea;">${data.resetUrl}</a>
              </p>
              <p style="color: #666; font-size: 14px; margin-top: 30px;">
                This link will expire in 10 minutes for security reasons.
              </p>
            </div>
            <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px;">
              <p>If you didn't request this password reset, please ignore this email and your password will remain unchanged.</p>
              <p>&copy; 2024 HerShield. Protecting women's digital rights.</p>
            </div>
          </div>
        `,
        text: `
Password Reset - HerShield

Hi ${data.firstName},

You requested to reset your password. Visit this link to create a new password:
${data.resetUrl}

This link will expire in 10 minutes for security reasons.

If you didn't request this password reset, please ignore this email and your password will remain unchanged.

© 2024 HerShield. Protecting women's digital rights.
        `
      };

    default:
      return {
        html: '<p>Email template not found</p>',
        text: 'Email template not found'
      };
  }
};

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    const transporter = createTransporter();
    const template = getEmailTemplate(options.template, options.data);

    const message = {
      from: `${process.env.FROM_NAME || 'HerShield'} <${process.env.FROM_EMAIL || 'noreply@hershield.com'}>`,
      to: options.to,
      subject: options.subject,
      text: template.text,
      html: template.html
    };

    const info = await transporter.sendMail(message);
    
    if (process.env.NODE_ENV === 'development') {
      logger.info(`Email sent: ${info.messageId}`);
      logger.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    } else {
      logger.info(`Email sent to ${options.to}: ${options.subject}`);
    }
  } catch (error) {
    logger.error('Email send error:', error);
    throw new Error('Email could not be sent');
  }
};
