import { Injectable } from '@nestjs/common';
import { NotifyEmailDto } from './dto/notify-email.dto';
import { ConfigService } from '@nestjs/config';
import { Transporter, createTransport } from 'nodemailer';

@Injectable()
export class NotificationsService {
  private readonly transport: Transporter;
  constructor(private readonly configService: ConfigService) {
    this.transport = createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT as string),
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD,
      },
    });
  }
  async notifyEmail({ email, text }: NotifyEmailDto) {
    try {
      await this.transport.sendMail({
        to: email,
        from: process.env.EMAIL_FROM,
        subject: 'Notification',
        text,
      });
      console.log('Email sent successfully to:', email);
    } catch (error) {
      console.error('Failed to send email to:', email, error);
    }
  }
}
