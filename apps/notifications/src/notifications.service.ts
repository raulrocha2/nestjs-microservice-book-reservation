import { Injectable } from '@nestjs/common';
import { NotifyEmailDto } from './dto/notify-email.dto';
import { ConfigService } from '@nestjs/config';
import { Transporter, createTransport } from 'nodemailer';

@Injectable()
export class NotificationsService {

  private readonly transport: Transporter;
  constructor(private readonly configService: ConfigService) {
    this.transport = createTransport({
      host: this.configService.get('EMAIL_HOST'),
      port: this.configService.get('EMAIL_PORT') as number,
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASSWORD') as string,
      },
    });
  }
  async notifyEmail({email, text}: NotifyEmailDto) {
    // Simulate sending an email notification
    console.log('-------notifyEmail service------->', email, text);

    // await this.transport.sendMail({
    //   to: email,
    //   from: 'noreply@example.com',
    //   subject: 'Notification',
    //   text,
    // });
  }
}
