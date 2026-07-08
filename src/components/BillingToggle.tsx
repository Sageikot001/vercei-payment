'use client';

import styled from 'styled-components';
import { BillingPeriod, billingPeriods } from '@/lib/plans';

const ToggleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const ToggleContainer = styled.div`
  display: flex;
  background: #f5f5f5;
  border-radius: 8px;
  padding: 4px;
`;

const ToggleButton = styled.button<{ $active: boolean }>`
  padding: 8px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background: ${({ $active }) => ($active ? '#000000' : 'transparent')};
  color: ${({ $active }) => ($active ? '#ffffff' : '#666666')};

  &:hover {
    color: ${({ $active }) => ($active ? '#ffffff' : '#000000')};
  }
`;

const SaveBadge = styled.span`
  font-size: 12px;
  color: #059669;
  font-weight: 600;
`;

interface BillingToggleProps {
  billingPeriod: BillingPeriod;
  onToggle: (period: BillingPeriod) => void;
}

export default function BillingToggle({ billingPeriod, onToggle }: BillingToggleProps) {
  return (
    <ToggleWrapper>
      <ToggleContainer>
        {billingPeriods.map((period) => (
          <ToggleButton
            key={period.id}
            $active={billingPeriod === period.id}
            onClick={() => onToggle(period.id)}
          >
            {period.label}
          </ToggleButton>
        ))}
      </ToggleContainer>
      {billingPeriod === '24-months' && (
        <SaveBadge>Save up to 60% with bi-yearly billing</SaveBadge>
      )}
      {billingPeriod === '12-months' && (
        <SaveBadge>Save up to 30% with yearly billing</SaveBadge>
      )}
    </ToggleWrapper>
  );
}
