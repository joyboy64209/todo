import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

const PLACEHOLDER_VALUES = ['your-gmail-address@gmail.com', 'your-16-char-gmail-app-password', ''];

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter: Transporter | null;
  private readonly smtpConfigured: boolean;

  constructor() {
    this.smtpConfigured = this.isSmtpConfigured();
    this.transporter = this.smtpConfigured ? this.createTransporter() : null;
  }

  private isSmtpConfigured(): boolean {
    const user = process.env.SMTP_USER ?? '';
    const pass = process.env.SMTP_PASS ?? '';
    return !PLACEHOLDER_VALUES.includes(user.trim()) && !PLACEHOLDER_VALUES.includes(pass.trim());
  }

  private createTransporter(): Transporter {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST ?? 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT ?? 465),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendOtp(email: string, otp: string): Promise<void> {
    if (!this.smtpConfigured || !this.transporter) {
      this.logger.warn(
        `SMTP not configured — dev mode. OTP for ${email}: ${otp}. ` +
          `Set SMTP_USER/SMTP_PASS to send real emails.`,
      );
      return;
    }

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Verify your Todo App account',
      text: `Your verification code is ${otp}. It expires in 10 minutes.`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      this.logger.error(`Failed to send OTP email to ${email}`, error);
      throw error;
    }
  }
}