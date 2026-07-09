'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Icons } from '@/components/icons';

const PageHeader = styled.div`
  margin-bottom: 32px;
`;

const Greeting = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #000000;
  margin: 0 0 8px 0;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #666666;
  margin: 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 32px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const StatIcon = styled.span`
  color: #666666;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatTrend = styled.span<{ $positive?: boolean }>`
  font-size: 12px;
  font-weight: 500;
  color: ${({ $positive }) => ($positive ? '#059669' : '#666666')};
`;

const StatValue = styled.p`
  font-size: 32px;
  font-weight: 700;
  color: #000000;
  margin: 0 0 4px 0;
`;

const StatLabel = styled.p`
  font-size: 13px;
  color: #666666;
  margin: 0;
`;

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  overflow: hidden;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #eaeaea;
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: #000000;
  margin: 0;
`;

const SectionLink = styled(Link)`
  font-size: 13px;
  color: #666666;
  text-decoration: none;

  &:hover {
    color: #000000;
  }
`;

const EmptyState = styled.div`
  padding: 48px 24px;
  text-align: center;
`;

const EmptyIcon = styled.div`
  color: #cccccc;
  margin-bottom: 16px;
  display: flex;
  justify-content: center;

  svg {
    width: 48px;
    height: 48px;
  }
`;

const EmptyTitle = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: #000000;
  margin: 0 0 8px 0;
`;

const EmptyText = styled.p`
  font-size: 14px;
  color: #666666;
  margin: 0 0 20px 0;
`;

const EmptyButton = styled(Link)`
  display: inline-block;
  padding: 10px 20px;
  background: #000000;
  color: #ffffff;
  text-decoration: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;

  &:hover {
    background: #333333;
  }
`;

const QuickAction = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  border-bottom: 1px solid #f5f5f5;
  text-decoration: none;
  transition: background 0.15s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f9f9f9;
  }
`;

const QuickActionIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666666;
`;

const QuickActionContent = styled.div`
  flex: 1;
`;

const QuickActionTitle = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: #000000;
  margin: 0 0 2px 0;
`;

const QuickActionDesc = styled.p`
  font-size: 12px;
  color: #666666;
  margin: 0;
`;

const QuickActionArrow = styled.span`
  color: #cccccc;
`;

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/dashboard');
    }
  }, [status, router]);

  if (status === 'loading' || !session) {
    return null;
  }

  const firstName = session.user?.name?.split(' ')[0] || 'there';

  return (
    <DashboardLayout>
      <PageHeader>
        <Greeting>Welcome back, {firstName}</Greeting>
        <Subtitle>Here&apos;s what&apos;s happening with your projects</Subtitle>
      </PageHeader>

      <StatsGrid>
        <StatCard>
          <StatHeader>
            <StatIcon>{Icons.projects}</StatIcon>
            <StatTrend>—</StatTrend>
          </StatHeader>
          <StatValue>0</StatValue>
          <StatLabel>Active Projects</StatLabel>
        </StatCard>
        <StatCard>
          <StatHeader>
            <StatIcon>{Icons.deployments}</StatIcon>
            <StatTrend>—</StatTrend>
          </StatHeader>
          <StatValue>0</StatValue>
          <StatLabel>Deployments</StatLabel>
        </StatCard>
        <StatCard>
          <StatHeader>
            <StatIcon>{Icons.visitors}</StatIcon>
            <StatTrend $positive>—</StatTrend>
          </StatHeader>
          <StatValue>0</StatValue>
          <StatLabel>Total Visitors</StatLabel>
        </StatCard>
        <StatCard>
          <StatHeader>
            <StatIcon>{Icons.storage}</StatIcon>
            <StatTrend>0%</StatTrend>
          </StatHeader>
          <StatValue>0 GB</StatValue>
          <StatLabel>Storage Used</StatLabel>
        </StatCard>
      </StatsGrid>

      <SectionGrid>
        <Section>
          <SectionHeader>
            <SectionTitle>Recent Activity</SectionTitle>
            <SectionLink href="/dashboard/deployments">View all</SectionLink>
          </SectionHeader>
          <EmptyState>
            <EmptyIcon>{Icons.inbox}</EmptyIcon>
            <EmptyTitle>No activity yet</EmptyTitle>
            <EmptyText>Deploy your first project to see activity here</EmptyText>
            <EmptyButton href="/dashboard/projects">Create Project</EmptyButton>
          </EmptyState>
        </Section>

        <Section>
          <SectionHeader>
            <SectionTitle>Quick Actions</SectionTitle>
          </SectionHeader>
          <QuickAction href="/dashboard/projects">
            <QuickActionIcon>{Icons.plus}</QuickActionIcon>
            <QuickActionContent>
              <QuickActionTitle>New Project</QuickActionTitle>
              <QuickActionDesc>Deploy a new site</QuickActionDesc>
            </QuickActionContent>
            <QuickActionArrow>{Icons.arrowRight}</QuickActionArrow>
          </QuickAction>
          <QuickAction href="/dashboard/domains">
            <QuickActionIcon>{Icons.globe}</QuickActionIcon>
            <QuickActionContent>
              <QuickActionTitle>Add Domain</QuickActionTitle>
              <QuickActionDesc>Connect a custom domain</QuickActionDesc>
            </QuickActionContent>
            <QuickActionArrow>{Icons.arrowRight}</QuickActionArrow>
          </QuickAction>
          <QuickAction href="/dashboard/settings">
            <QuickActionIcon>{Icons.settings}</QuickActionIcon>
            <QuickActionContent>
              <QuickActionTitle>Settings</QuickActionTitle>
              <QuickActionDesc>Manage your account</QuickActionDesc>
            </QuickActionContent>
            <QuickActionArrow>{Icons.arrowRight}</QuickActionArrow>
          </QuickAction>
        </Section>
      </SectionGrid>
    </DashboardLayout>
  );
}
