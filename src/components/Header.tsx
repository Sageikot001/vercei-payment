'use client';

import styled from 'styled-components';
import Link from 'next/link';

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

  span {
    color: #0070f3;
  }
`;

const NavLink = styled(Link)`
  font-size: 14px;
  color: #666666;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 6px;
  transition: background 0.2s;

  &:hover {
    background: #fafafa;
    color: #000000;
  }
`;

export default function Header() {
  return (
    <HeaderWrapper>
      <Logo href="/">
        Verce<span>I</span>
      </Logo>
      <NavLink href="/login">Login</NavLink>
    </HeaderWrapper>
  );
}
