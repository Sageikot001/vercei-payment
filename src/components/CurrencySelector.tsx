'use client';

import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { currencies, getCurrencyInfo } from '@/lib/currency';

const SelectorWrapper = styled.div`
  position: relative;
`;

const SelectorButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: #f5f5f5;
  border: 1px solid #eaeaea;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  color: #333333;

  &:hover {
    background: #eeeeee;
    border-color: #dddddd;
  }
`;

const CurrencyCode = styled.span`
  font-weight: 600;
`;

const Arrow = styled.span<{ $open: boolean }>`
  font-size: 10px;
  transition: transform 0.2s;
  transform: ${({ $open }) => ($open ? 'rotate(180deg)' : 'rotate(0)')};
`;

const Dropdown = styled.div<{ $open: boolean }>`
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  width: 220px;
  max-height: 320px;
  overflow-y: auto;
  background: #ffffff;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  display: ${({ $open }) => ($open ? 'block' : 'none')};
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: none;
  border-bottom: 1px solid #eaeaea;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;

  &::placeholder {
    color: #999999;
  }
`;

const CurrencyList = styled.div`
  max-height: 260px;
  overflow-y: auto;
`;

const CurrencyOption = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px 12px;
  border: none;
  background: ${({ $selected }) => ($selected ? '#f5f5f5' : 'transparent')};
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;

  &:hover {
    background: #f5f5f5;
  }
`;

const CurrencyInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CurrencySymbol = styled.span`
  width: 24px;
  font-size: 14px;
  color: #666666;
`;

const CurrencyName = styled.span`
  font-size: 14px;
  color: #333333;
`;

const CurrencyCodeSmall = styled.span`
  font-size: 12px;
  color: #999999;
  font-weight: 500;
`;

interface CurrencySelectorProps {
  currency: string;
  onSelect: (currency: string) => void;
}

export default function CurrencySelector({ currency, onSelect }: CurrencySelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const currentCurrency = getCurrencyInfo(currency);

  const filteredCurrencies = currencies.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: string) => {
    onSelect(code);
    setOpen(false);
    setSearch('');
  };

  return (
    <SelectorWrapper ref={wrapperRef}>
      <SelectorButton onClick={() => setOpen(!open)}>
        <span>{currentCurrency?.symbol}</span>
        <CurrencyCode>{currency}</CurrencyCode>
        <Arrow $open={open}>▼</Arrow>
      </SelectorButton>
      <Dropdown $open={open}>
        <SearchInput
          type="text"
          placeholder="Search currency..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus={open}
        />
        <CurrencyList>
          {filteredCurrencies.map((c) => (
            <CurrencyOption
              key={c.code}
              $selected={c.code === currency}
              onClick={() => handleSelect(c.code)}
            >
              <CurrencyInfo>
                <CurrencySymbol>{c.symbol}</CurrencySymbol>
                <CurrencyName>{c.name}</CurrencyName>
              </CurrencyInfo>
              <CurrencyCodeSmall>{c.code}</CurrencyCodeSmall>
            </CurrencyOption>
          ))}
        </CurrencyList>
      </Dropdown>
    </SelectorWrapper>
  );
}
