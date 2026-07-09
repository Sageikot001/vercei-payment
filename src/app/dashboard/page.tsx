'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import styled from 'styled-components';
import Header from '@/components/Header';

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #fafafa;
`;

const Main = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 24px;
`;

const WelcomeSection = styled.section`
  margin-bottom: 48px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #000000;
  margin: 0 0 8px 0;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #666666;
  margin: 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
`;

const StatCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

const StatLabel = styled.p`
  font-size: 14px;
  color: #666666;
  margin: 0 0 8px 0;
`;

const StatValue = styled.p`
  font-size: 32px;
  font-weight: 700;
  color: #000000;
  margin: 0;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #000000;
  margin: 0 0 24px 0;
`;

const EmptyState = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 48px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

const EmptyText = styled.p`
  font-size: 16px;
  color: #666666;
  margin: 0 0 24px 0;
`;

const CTAButton = styled.a`
  display: inline-block;
  padding: 12px 24px;
  background: #000000;
  color: #ffffff;
  text-decoration: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  transition: background 0.2s;

  &:hover {
    background: #333333;
  }
`;

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/dashboard');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <PageWrapper>
        <Header />
        <Main>
          <p>Loading...</p>
        </Main>
      </PageWrapper>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <PageWrapper>
      <Header />
      <Main>
        <WelcomeSection>
          <Title>Welcome back, {session.user?.name || 'User'}</Title>
          <Subtitle>Manage your VerceI hosting from here</Subtitle>
        </WelcomeSection>

        <StatsGrid>
          <StatCard>
            <StatLabel>Active Sites</StatLabel>
            <StatValue>0</StatValue>
          </StatCard>
          <StatCard>
            <StatLabel>Bandwidth Used</StatLabel>
            <StatValue>0 GB</StatValue>
          </StatCard>
          <StatCard>
            <StatLabel>Storage Used</StatLabel>
            <StatValue>0 GB</StatValue>
          </StatCard>
          <StatCard>
            <StatLabel>Current Plan</StatLabel>
            <StatValue>None</StatValue>
          </StatCard>
        </StatsGrid>

        <SectionTitle>Your Projects</SectionTitle>
        <EmptyState>
          <EmptyText>You don&apos;t have any projects yet. Subscribe to a plan to get started.</EmptyText>
          <CTAButton href="/pricing">View Plans</CTAButton>
        </EmptyState>
      </Main>
    </PageWrapper>
  );
}
