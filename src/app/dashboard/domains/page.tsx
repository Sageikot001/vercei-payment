'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #000000;
  margin: 0;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #000000;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: #333333;
  }
`;

const DomainList = styled.div`
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  overflow: hidden;
`;

const DomainItem = styled.div`
  display: flex;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f5f5f5;
  gap: 16px;

  &:last-child {
    border-bottom: none;
  }
`;

const DomainIcon = styled.div`
  width: 40px;
  height: 40px;
  background: #f5f5f5;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`;

const DomainInfo = styled.div`
  flex: 1;
`;

const DomainName = styled.p`
  font-size: 15px;
  font-weight: 600;
  color: #000000;
  margin: 0 0 4px 0;
`;

const DomainProject = styled.p`
  font-size: 13px;
  color: #666666;
  margin: 0;
`;

const StatusBadge = styled.span<{ $status: string }>`
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  background: ${({ $status }) =>
    $status === 'active' ? '#dcfce7' :
    $status === 'pending' ? '#fef3c7' :
    '#fee2e2'
  };
  color: ${({ $status }) =>
    $status === 'active' ? '#166534' :
    $status === 'pending' ? '#92400e' :
    '#991b1b'
  };
`;

const SSLBadge = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #059669;
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  background: #f5f5f5;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  color: #333333;
  cursor: pointer;

  &:hover {
    background: #eaeaea;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 24px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 24px;
`;

const EmptyTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #000000;
  margin: 0 0 8px 0;
`;

const EmptyText = styled.p`
  font-size: 14px;
  color: #666666;
  margin: 0 0 24px 0;
`;

const mockDomains = [
  {
    id: '1',
    domain: 'myportfolio.com',
    project: 'portfolio-site',
    status: 'active',
    ssl: true,
  },
  {
    id: '2',
    domain: 'www.myportfolio.com',
    project: 'portfolio-site',
    status: 'active',
    ssl: true,
  },
  {
    id: '3',
    domain: 'shop.mybrand.com',
    project: 'e-commerce-store',
    status: 'pending',
    ssl: false,
  },
];

export default function DomainsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showMock, setShowMock] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/dashboard/domains');
    }
  }, [status, router]);

  if (status === 'loading' || !session) {
    return null;
  }

  const domains = showMock ? mockDomains : [];

  return (
    <DashboardLayout>
      <PageHeader>
        <Title>Domains</Title>
        <AddButton onClick={() => setShowMock(!showMock)}>
          {showMock ? '✕ Clear Demo' : '➕ Show Demo'}
        </AddButton>
      </PageHeader>

      {domains.length === 0 ? (
        <EmptyState>
          <EmptyIcon>🌐</EmptyIcon>
          <EmptyTitle>No domains configured</EmptyTitle>
          <EmptyText>Connect a custom domain to your projects</EmptyText>
          <AddButton onClick={() => setShowMock(true)}>Show Demo Domains</AddButton>
        </EmptyState>
      ) : (
        <DomainList>
          {domains.map((domain) => (
            <DomainItem key={domain.id}>
              <DomainIcon>🌐</DomainIcon>
              <DomainInfo>
                <DomainName>{domain.domain}</DomainName>
                <DomainProject>→ {domain.project}</DomainProject>
              </DomainInfo>
              {domain.ssl && (
                <SSLBadge>🔒 SSL</SSLBadge>
              )}
              <StatusBadge $status={domain.status}>
                {domain.status}
              </StatusBadge>
              <ActionButton>Configure</ActionButton>
            </DomainItem>
          ))}
        </DomainList>
      )}
    </DashboardLayout>
  );
}
