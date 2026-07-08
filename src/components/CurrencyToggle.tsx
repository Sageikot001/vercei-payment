'use client';

import styled from 'styled-components';
import { Currency, EXCHANGE_RATE } from '@/lib/currency';

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

const ExchangeRate = styled.span`
  font-size: 12px;
  color: #666666;
`;

interface CurrencyToggleProps {
  currency: Currency;
  onToggle: (currency: Currency) => void;
}

export default function CurrencyToggle({ currency, onToggle }: CurrencyToggleProps) {
  return (
    <ToggleWrapper>
      <ToggleContainer>
        <ToggleButton $active={currency === 'USD'} onClick={() => onToggle('USD')}>
          USD
        </ToggleButton>
        <ToggleButton $active={currency === 'NGN'} onClick={() => onToggle('NGN')}>
          NGN
        </ToggleButton>
      </ToggleContainer>
      {currency === 'NGN' && (
        <ExchangeRate>Prices shown at ₦{EXCHANGE_RATE.toLocaleString()}/USD</ExchangeRate>
      )}
    </ToggleWrapper>
  );
}
