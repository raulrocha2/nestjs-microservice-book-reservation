import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { NOTIFICATIONS_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { PaymentCreateChargeDto } from './dto/payment-create-charge.dto';

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationService: ClientProxy,
  ) {
    this.stripe = new Stripe(
      this.configService.get('STRIPE_SECRET_KEY') as string,
    );
  }
  async createCharge({ card, amount, email }: PaymentCreateChargeDto) {
    let text: string = '';
    const paymentMethod = await this.stripe.paymentMethods.create({
      type: 'card',
      card: {
        token: card.token,
      },
    });

    const paymentIntent = await this.stripe.paymentIntents.create({
      payment_method: paymentMethod.id,
      amount: amount * 100,
      confirm: true,
      payment_method_types: ['card'],
      currency: 'usd',
    });
    if (paymentIntent.status === 'succeeded') {
      text = `Charge with id ${paymentIntent.id} amount ${amount} created successfully`;
    } else {
      text = `Charge with id ${paymentIntent.id} amount ${amount} failed`;
    }
    console.log(
      '-------Payments Service------->',
      email,
      text,
      paymentIntent.id,
    );
    this.notificationService.emit('notify_email', {
      email,
      text,
    });
    return paymentIntent;
  }
}
