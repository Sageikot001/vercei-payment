'use client';

import styled from 'styled-components';
import { Plan, BillingPeriod, features, calculateTotal, getBillingPeriod } from '@/lib/plans';
import { Currency, formatPrice } from '@/lib/currency';

const Card = styled.div<{ $tag?: string }>`
  background: #ffffff;
  border: 2px solid ${({ $tag }) =>
    $tag === 'popular' ? '#7c3aed' :
    $tag === 'best-value' ? '#059669' : '#eaeaea'};
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  }
`;

const Tag = styled.span<{ $type: 'popular' | 'best-value' }>`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  background: ${({ $type }) => ($type === 'popular' ? '#7c3aed' : '#059669')};
  color: #ffffff;
`;

const PlanName = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #000000;
  margin: 0 0 16px 0;
  text-align: center;
`;

const PriceContainer = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

const MonthlyPrice = styled.div`
  font-size: 36px;
  font-weight: 700;
  color: #000000;
`;

const TotalPrice = styled.div`
  font-size: 14px;
  color: #666666;
  margin-top: 4px;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 24px 0;
  flex: 1;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  font-size: 14px;
  color: #333333;
  border-bottom: 1px solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }

  &::before {
    content: '✓';
    color: #059669;
    font-weight: 600;
  }
`;

const Bonus = styled.div`
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  padding: 12px;
  font-size: 13px;
  color: #166534;
  text-align: center;
  margin-bottom: 16px;
`;

const SelectButton = styled.button<{ $primary?: boolean }>`
  width: 100%;
  padding: 14px 24px;
  border: ${({ $primary }) => ($primary ? 'none' : '2px solid #000000')};
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background: ${({ $primary }) => ($primary ? '#000000' : '#ffffff')};
  color: ${({ $primary }) => ($primary ? '#ffffff' : '#000000')};

  &:hover {
    background: ${({ $primary }) => ($primary ? '#333333' : '#000000')};
    color: #ffffff;
  }
`;

interface PlanCardProps {
  plan: Plan;
  planIndex: number;
  billingPeriod: BillingPeriod;
  currency: Currency;
  onSelect: (plan: Plan) => void;
}

export default function PlanCard({ plan, planIndex, billingPeriod, currency, onSelect }: PlanCardProps) {
  const displayFeatures = features.slice(0, 5).map((feature) => ({
    name: feature.name,
    value: feature.values[planIndex],
  }));

  const monthlyPrice = plan.pricing[billingPeriod];
  const totalPrice = calculateTotal(plan, billingPeriod);
  const period = getBillingPeriod(billingPeriod);

  return (
    <Card $tag={plan.tag}>
      {plan.tag && (
        <Tag $type={plan.tag}>
          {plan.tag === 'popular' ? 'Popular' : 'Best Value'}
        </Tag>
      )}
      <PlanName>{plan.name}</PlanName>
      <PriceContainer>
        <MonthlyPrice>{formatPrice(monthlyPrice, currency)}/mo</MonthlyPrice>
        <TotalPrice>{formatPrice(totalPrice, currency)} for {period?.months} months</TotalPrice>
      </PriceContainer>
      <FeatureList>
        {displayFeatures.map((feature) => (
          <FeatureItem key={feature.name}>
            {feature.name}: {feature.value}
          </FeatureItem>
        ))}
      </FeatureList>
      {plan.bonus && <Bonus>{plan.bonus}</Bonus>}
      <SelectButton $primary={plan.tag === 'popular'} onClick={() => onSelect(plan)}>
        Select Plan
      </SelectButton>
    </Card>
  );
}
