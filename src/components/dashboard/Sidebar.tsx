'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SidebarWrapper = styled.aside`
  width: 240px;
  background: #ffffff;
  border-right: 1px solid #eaeaea;
  height: calc(100vh - 65px);
  position: fixed;
  top: 65px;
  left: 0;
  overflow-y: auto;
  padding: 24px 0;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavSection = styled.div`
  margin-bottom: 24px;
`;

const SectionLabel = styled.p`
  font-size: 11px;
  font-weight: 600;
  color: #999999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0 24px;
  margin: 0 0 8px 0;
`;

const NavItem = styled(Link)<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 24px;
  font-size: 14px;
  color: ${({ $active }) => ($active ? '#000000' : '#666666')};
  text-decoration: none;
  background: ${({ $active }) => ($active ? '#f5f5f5' : 'transparent')};
  border-left: 3px solid ${({ $active }) => ($active ? '#000000' : 'transparent')};
  transition: all 0.15s;

  &:hover {
    background: #f5f5f5;
    color: #000000;
  }
`;

const NavIcon = styled.span`
  font-size: 18px;
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PlanBadge = styled.div`
  margin: 24px;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 8px;
`;

const PlanLabel = styled.p`
  font-size: 12px;
  color: #666666;
  margin: 0 0 4px 0;
`;

const PlanName = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: #000000;
  margin: 0 0 12px 0;
`;

const UpgradeButton = styled(Link)`
  display: block;
  text-align: center;
  padding: 8px 16px;
  background: #000000;
  color: #ffffff;
  text-decoration: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  transition: background 0.2s;

  &:hover {
    background: #333333;
  }
`;

const mainNav = [
  { href: '/dashboard', icon: '📊', label: 'Overview' },
  { href: '/dashboard/projects', icon: '📁', label: 'Projects' },
  { href: '/dashboard/deployments', icon: '🚀', label: 'Deployments' },
  { href: '/dashboard/domains', icon: '🌐', label: 'Domains' },
  { href: '/dashboard/analytics', icon: '📈', label: 'Analytics' },
];

const accountNav = [
  { href: '/dashboard/settings', icon: '⚙️', label: 'Settings' },
  { href: '/dashboard/billing', icon: '💳', label: 'Billing' },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <SidebarWrapper>
      <NavSection>
        <SectionLabel>Main</SectionLabel>
        {mainNav.map((item) => (
          <NavItem key={item.href} href={item.href} $active={isActive(item.href)}>
            <NavIcon>{item.icon}</NavIcon>
            {item.label}
          </NavItem>
        ))}
      </NavSection>

      <NavSection>
        <SectionLabel>Account</SectionLabel>
        {accountNav.map((item) => (
          <NavItem key={item.href} href={item.href} $active={isActive(item.href)}>
            <NavIcon>{item.icon}</NavIcon>
            {item.label}
          </NavItem>
        ))}
      </NavSection>

      <PlanBadge>
        <PlanLabel>Current Plan</PlanLabel>
        <PlanName>No Active Plan</PlanName>
        <UpgradeButton href="/pricing">Upgrade</UpgradeButton>
      </PlanBadge>
    </SidebarWrapper>
  );
}
