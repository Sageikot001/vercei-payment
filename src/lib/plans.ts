export type BillingPeriod = '1-month' | '6-months' | '12-months' | '24-months';

export interface PlanPricing {
  '1-month': number;
  '6-months': number;
  '12-months': number;
  '24-months': number;
}

export interface Plan {
  id: string;
  name: string;
  pricing: PlanPricing;
  tag?: 'popular' | 'best-value';
  bonus?: string;
}

export interface PlanFeature {
  name: string;
  values: [string, string, string];
}

export const billingPeriods: { id: BillingPeriod; label: string; months: number }[] = [
  { id: '1-month', label: '1 Month (Test)', months: 1 },
  { id: '6-months', label: '6 Months', months: 6 },
  { id: '12-months', label: 'Yearly', months: 12 },
  { id: '24-months', label: 'Bi-Yearly', months: 24 },
];

export const plans: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    pricing: {
      '1-month': 2,
      '6-months': 10,
      '12-months': 7,
      '24-months': 4,
    },
  },
  {
    id: 'standard',
    name: 'Standard',
    pricing: {
      '1-month': 3,
      '6-months': 14,
      '12-months': 8,
      '24-months': 5,
    },
    tag: 'popular',
    bonus: 'Free migration from other hosts',
  },
  {
    id: 'premium',
    name: 'Premium',
    pricing: {
      '1-month': 5,
      '6-months': 20,
      '12-months': 11,
      '24-months': 8,
    },
    tag: 'best-value',
    bonus: '1 hour onboarding call + custom subdomain',
  },
];

export const features: PlanFeature[] = [
  { name: 'Storage', values: ['5 GB', '10 GB', '20 GB'] },
  { name: 'Custom Domains', values: ['1', '3', '5'] },
  { name: 'Bandwidth', values: ['100 GB/mo', '500 GB/mo', '1 TB/mo'] },
  { name: 'Build Minutes', values: ['300/mo', '1,000/mo', '3,000/mo'] },
  { name: 'Team Members', values: ['1', '3', '10'] },
  { name: 'Support', values: ['Email (48hr)', 'Email (24hr)', 'Priority (4hr)'] },
  { name: 'SSL Certificates', values: ['Shared', 'Free dedicated', 'Free dedicated'] },
  { name: 'Deployment Rollbacks', values: ['3 days', '14 days', '30 days'] },
  { name: 'Analytics', values: ['Basic', 'Advanced', 'Advanced + API'] },
  { name: 'Preview Deployments', values: ['3 active', '10 active', 'Unlimited'] },
  { name: 'Serverless Functions', values: ['10k inv/mo', '100k inv/mo', '500k inv/mo'] },
];

export function getPlanById(id: string): Plan | undefined {
  return plans.find((plan) => plan.id === id);
}

export function getBillingPeriod(id: BillingPeriod) {
  return billingPeriods.find((bp) => bp.id === id);
}

export function calculateTotal(plan: Plan, billingPeriod: BillingPeriod): number {
  const period = getBillingPeriod(billingPeriod);
  if (!period) return 0;
  return plan.pricing[billingPeriod] * period.months;
}
