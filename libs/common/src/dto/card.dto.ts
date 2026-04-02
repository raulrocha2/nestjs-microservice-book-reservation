import { IsCreditCard, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";

export enum StripeTestCardToken {
  VisaSuccess = 'tok_visa',
  ChargeDeclined = 'tok_chargeDeclined',
  MastercardSuccess = 'tok_mastercard',
}
export class CardDto {
  @IsCreditCard()
  number: string;

  @IsNumber()
  @IsNotEmpty()
  exp_month: number;

  @IsNumber()
  @IsNotEmpty()
  exp_year: number;

  @IsString()
  @IsNotEmpty()
  cvc: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(StripeTestCardToken)
  token: string;
}

