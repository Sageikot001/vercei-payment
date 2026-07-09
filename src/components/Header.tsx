'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import CurrencySelector from './CurrencySelector';

const HeaderWrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #eaeaea;
  background: #ffffff;
`;

const Logo = styled(Link)`
  font-size: 24px;
  font-weight: 700;
  color: #000000;
  text-decoration: none;
  letter-spacing: -0.5px;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (min-width: 768px) {
    gap: 16px;
  }
`;

const NavLink = styled(Link)`
  font-size: 14px;
  color: #666666;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background 0.2s;

  &:hover {
    background: #fafafa;
    color: #000000;
  }

  @media (min-width: 768px) {
    padding: 8px 16px;
  }
`;

const SignOutButton = styled.button`
  font-size: 14px;
  color: #666666;
  background: none;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #fafafa;
    color: #000000;
  }
`;

const UserName = styled.span`
  font-size: 14px;
  color: #333333;
  font-weight: 500;
  display: none;

  @media (min-width: 768px) {
    display: inline;
  }
`;

interface HeaderProps {
  currency?: string;
  onCurrencyChange?: (currency: string) => void;
}

export default function Header({ currency, onCurrencyChange }: HeaderProps) {
  const { data: session, status } = useSession();

  return (
    <HeaderWrapper>
      <Logo href="/">VerceI</Logo>
      <RightSection>
        {currency && onCurrencyChange && (
          <CurrencySelector currency={currency} onSelect={onCurrencyChange} />
        )}
        <NavLink href="/pricing">Pricing</NavLink>
        {status === 'loading' ? null : session ? (
          <>
            <NavLink href="/dashboard">Dashboard</NavLink>
            <UserName>{session.user?.name}</UserName>
            <SignOutButton onClick={() => signOut({ callbackUrl: '/' })}>
              Sign Out
            </SignOutButton>
          </>
        ) : (
          <NavLink href="/login">Login</NavLink>
        )}
      </RightSection>
    </HeaderWrapper>
  );
}
