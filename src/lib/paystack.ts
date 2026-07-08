import { Plan } from './plans';
import { Currency, convertToNGN } from './currency';

export interface PaystackInitResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export function generateReference(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `vercei_${timestamp}_${random}`;
}

export function getAmountInKobo(plan: Plan, currency: Currency): number {
  const amountInNGN = currency === 'NGN' ? convertToNGN(plan.priceUSD) : convertToNGN(plan.priceUSD);
  return Math.round(amountInNGN * 100);
}
