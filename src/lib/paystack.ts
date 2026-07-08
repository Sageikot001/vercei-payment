import { Plan, BillingPeriod, calculateTotal } from './plans';
import { convertToNGN } from './currency';

export interface PaystackInitResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export function generateReference(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `VerceI_${timestamp}_${random}`;
}

export function getAmountInKobo(plan: Plan, billingPeriod: BillingPeriod): number {
  const totalUSD = calculateTotal(plan, billingPeriod);
  const amountInNGN = convertToNGN(totalUSD);
  return Math.round(amountInNGN * 100);
}
