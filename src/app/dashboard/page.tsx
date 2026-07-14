'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Icons } from '@/components/icons';
import { useDashboard } from '@/hooks/useDashboard';
import { useSubscription } from '@/hooks/useSubscription';

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

const PlanBanner = styled.div<{ $status: string }>`
  background: ${({ $status }) =>
    $status === 'active' ? '#ffffff' :
    $status === 'expiring' ? '#fffbeb' :
    $status === 'expired' ? '#fef2f2' :
    '#f5f5f5'
  };
  border: 1px solid ${({ $status }) =>
    $status === 'active' ? '#eaeaea' :
    $status === 'expiring' ? '#fcd34d' :
    $status === 'expired' ? '#fecaca' :
    '#eaeaea'
  };
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
`;

const PlanInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  min-width: 200px;
`;

const PlanIcon = styled.div`
  width: 40px;
  height: 40px;
  background: #000000;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
`;

const PlanDetails = styled.div``;

const PlanTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 4px;
`;

const PlanName = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #000000;
`;

const PlanStatusBadge = styled.span<{ $status: string }>`
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  background: ${({ $status }) =>
    $status === 'active' ? '#dcfce7' :
    $status === 'expiring' ? '#fef3c7' :
    $status === 'expired' ? '#fee2e2' :
    '#f5f5f5'
  };
  color: ${({ $status }) =>
    $status === 'active' ? '#166534' :
    $status === 'expiring' ? '#92400e' :
    $status === 'expired' ? '#991b1b' :
    '#666666'
  };
`;

const PlanMeta = styled.span`
  font-size: 13px;
  color: #666666;
`;

const PlanProgress = styled.div`
  flex: 1;
  max-width: 300px;
  min-width: 150px;
`;

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666666;
  margin-bottom: 6px;
`;

const ProgressBar = styled.div`
  height: 6px;
  background: #eaeaea;
  border-radius: 3px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $percent: number; $status: string }>`
  height: 100%;
  width: ${({ $percent }) => $percent}%;
  background: ${({ $status }) =>
    $status === 'active' ? '#000000' :
    $status === 'expiring' ? '#f59e0b' :
    '#ef4444'
  };
  border-radius: 3px;
  transition: width 0.3s ease;
`;

const PlanActions = styled.div`
  display: flex;
  gap: 12px;
`;

const ManageButton = styled(Link)`
  padding: 10px 20px;
  background: #000000;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    background: #333333;
  }
`;

const NoPlanBanner = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
`;

const NoPlanContent = styled.div`
  color: #ffffff;
`;

const NoPlanTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 4px 0;
`;

const NoPlanText = styled.p`
  font-size: 14px;
  opacity: 0.9;
  margin: 0;
`;

const GetStartedButton = styled(Link)`
  padding: 12px 24px;
  background: #ffffff;
  color: #000000;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    background: #f5f5f5;
  }
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

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  border-bottom: 1px solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }
`;

const ActivityDot = styled.div<{ $status: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $status }) =>
    $status === 'ready' ? '#22c55e' :
    $status === 'building' ? '#f59e0b' :
    $status === 'error' ? '#ef4444' :
    '#999999'
  };
`;

const ActivityInfo = styled.div`
  flex: 1;
`;

const ActivityMessage = styled.p`
  font-size: 14px;
  color: #000000;
  margin: 0 0 2px 0;
`;

const ActivityMeta = styled.p`
  font-size: 12px;
  color: #666666;
  margin: 0;
`;

const ErrorBanner = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const ErrorText = styled.p`
  color: #991b1b;
  font-size: 14px;
  margin: 0;
`;

const RetryButton = styled.button`
  padding: 8px 16px;
  background: #991b1b;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;

  &:hover {
    background: #7f1d1d;
  }
`;

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { stats, loading, error, refetch } = useDashboard();
  const { subscription, isActive, daysRemaining, loading: subLoading, error: subError, refetch: subRefetch } = useSubscription();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/dashboard');
    }
  }, [status, router]);

  if (status === 'loading' || !session) {
    return null;
  }

  const firstName = session.user?.name?.split(' ')[0] || 'there';

  // Calculate subscription status
  const getSubscriptionStatus = () => {
    if (!subscription || subscription.status !== 'active') return 'none';
    if (daysRemaining !== null && daysRemaining <= 0) return 'expired';
    if (daysRemaining !== null && daysRemaining <= 7) return 'expiring';
    return 'active';
  };

  const subscriptionStatus = getSubscriptionStatus();

  // Calculate progress percentage
  const getProgressPercent = () => {
    if (!subscription) return 0;
    const billingMonths = parseInt(subscription.billing_period.split('-')[0]);
    const totalDays = billingMonths * 30;
    const elapsed = totalDays - (daysRemaining || 0);
    return Math.min(100, Math.max(0, (elapsed / totalDays) * 100));
  };

  const formatExpiryDate = () => {
    if (!subscription?.expires_at) return '';
    return new Date(subscription.expires_at).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getPlanDisplayName = (plan: string) => {
    return plan.charAt(0).toUpperCase() + plan.slice(1);
  };

  return (
    <DashboardLayout>
      <PageHeader>
        <Greeting>Welcome back, {firstName}</Greeting>
        <Subtitle>Here&apos;s what&apos;s happening with your projects</Subtitle>
      </PageHeader>

      {subLoading ? (
        <NoPlanBanner>
          <NoPlanContent>
            <NoPlanTitle>Loading subscription...</NoPlanTitle>
          </NoPlanContent>
        </NoPlanBanner>
      ) : subError ? (
        <ErrorBanner>
          <ErrorText>Failed to load subscription. Please try again.</ErrorText>
          <RetryButton onClick={subRefetch}>Retry</RetryButton>
        </ErrorBanner>
      ) : subscription && isActive ? (
        <PlanBanner $status={subscriptionStatus}>
          <PlanInfo>
            <PlanIcon>{Icons.zap}</PlanIcon>
            <PlanDetails>
              <PlanTitle>
                <PlanName>{getPlanDisplayName(subscription.plan)} Plan</PlanName>
                <PlanStatusBadge $status={subscriptionStatus}>
                  {subscriptionStatus === 'expiring' ? 'Expiring Soon' :
                   subscriptionStatus === 'expired' ? 'Expired' : 'Active'}
                </PlanStatusBadge>
              </PlanTitle>
              <PlanMeta>
                {daysRemaining !== null && daysRemaining > 0
                  ? `${daysRemaining} days remaining`
                  : 'Expired'}
              </PlanMeta>
            </PlanDetails>
          </PlanInfo>
          <PlanProgress>
            <ProgressLabel>
              <span>Billing Period</span>
              <span>Renews {formatExpiryDate()}</span>
            </ProgressLabel>
            <ProgressBar>
              <ProgressFill $percent={getProgressPercent()} $status={subscriptionStatus} />
            </ProgressBar>
          </PlanProgress>
          <PlanActions>
            <ManageButton href="/dashboard/billing">Manage</ManageButton>
          </PlanActions>
        </PlanBanner>
      ) : (
        <NoPlanBanner>
          <NoPlanContent>
            <NoPlanTitle>Get started with a plan</NoPlanTitle>
            <NoPlanText>Unlock all features and start deploying your projects</NoPlanText>
          </NoPlanContent>
          <GetStartedButton href="/pricing">View Plans</GetStartedButton>
        </NoPlanBanner>
      )}

      {error && (
        <ErrorBanner>
          <ErrorText>Failed to load dashboard data. Please try again.</ErrorText>
          <RetryButton onClick={refetch}>Retry</RetryButton>
        </ErrorBanner>
      )}

      <StatsGrid>
        <StatCard>
          <StatHeader>
            <StatIcon>{Icons.projects}</StatIcon>
            <StatTrend>—</StatTrend>
          </StatHeader>
          <StatValue>{loading ? '—' : error ? '—' : stats?.projects || 0}</StatValue>
          <StatLabel>Active Projects</StatLabel>
        </StatCard>
        <StatCard>
          <StatHeader>
            <StatIcon>{Icons.deployments}</StatIcon>
            <StatTrend>—</StatTrend>
          </StatHeader>
          <StatValue>{loading ? '—' : stats?.deployments || 0}</StatValue>
          <StatLabel>Deployments (30d)</StatLabel>
        </StatCard>
        <StatCard>
          <StatHeader>
            <StatIcon>{Icons.globe}</StatIcon>
            <StatTrend>—</StatTrend>
          </StatHeader>
          <StatValue>{loading ? '—' : stats?.domains || 0}</StatValue>
          <StatLabel>Domains</StatLabel>
        </StatCard>
        <StatCard>
          <StatHeader>
            <StatIcon>{Icons.storage}</StatIcon>
            <StatTrend>0%</StatTrend>
          </StatHeader>
          <StatValue>{loading ? '—' : `${stats?.storage || 0} GB`}</StatValue>
          <StatLabel>Storage Used</StatLabel>
        </StatCard>
      </StatsGrid>

      <SectionGrid>
        <Section>
          <SectionHeader>
            <SectionTitle>Recent Activity</SectionTitle>
            <SectionLink href="/dashboard/deployments">View all</SectionLink>
          </SectionHeader>
          {!loading && stats?.recentActivity && stats.recentActivity.length > 0 ? (
            stats.recentActivity.map((activity) => (
              <ActivityItem key={activity.id}>
                <ActivityDot $status={activity.status} />
                <ActivityInfo>
                  <ActivityMessage>{activity.message}</ActivityMessage>
                  <ActivityMeta>{activity.project} • {activity.time}</ActivityMeta>
                </ActivityInfo>
              </ActivityItem>
            ))
          ) : (
            <EmptyState>
              <EmptyIcon>{Icons.inbox}</EmptyIcon>
              <EmptyTitle>No activity yet</EmptyTitle>
              <EmptyText>Deploy your first project to see activity here</EmptyText>
              <EmptyButton href="/dashboard/projects/new">Create Project</EmptyButton>
            </EmptyState>
          )}
        </Section>

        <Section>
          <SectionHeader>
            <SectionTitle>Quick Actions</SectionTitle>
          </SectionHeader>
          <QuickAction href="/dashboard/projects/new">
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
