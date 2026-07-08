export interface PlanFeature {
  name: string;
  values: [string, string, string];
}

export interface Plan {
  id: string;
  name: string;
  duration: number;
  priceUSD: number;
  pricePerMonth: number;
  tag?: 'popular' | 'best-value';
  bonus?: string;
}

export const plans: Plan[] = [
  {
    id: '6-months',
    name: '6 Months',
    duration: 6,
    priceUSD: 120,
    pricePerMonth: 20,
  },
  {
    id: '12-months',
    name: '12 Months',
    duration: 12,
    priceUSD: 192,
    pricePerMonth: 16,
    tag: 'popular',
    bonus: 'Free migration from other hosts',
  },
  {
    id: '24-months',
    name: '24 Months',
    duration: 24,
    priceUSD: 336,
    pricePerMonth: 14,
    tag: 'best-value',
    bonus: '1 hour onboarding call + custom subdomain',
  },
];

export const features: PlanFeature[] = [
  { name: 'Project', values: ['1 site', '1 site', '1 site'] },
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
