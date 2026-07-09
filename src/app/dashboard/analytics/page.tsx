'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Icons } from '@/components/icons';
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

const DateRange = styled.select`
  padding: 8px 16px;
  border: 1px solid #eaeaea;
  border-radius: 6px;
  font-size: 14px;
  background: #ffffff;
  cursor: pointer;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 32px;

  @media (max-width: 1000px) {
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

const StatLabel = styled.p`
  font-size: 13px;
  color: #666666;
  margin: 0 0 8px 0;
`;

const StatValue = styled.p`
  font-size: 28px;
  font-weight: 700;
  color: #000000;
  margin: 0 0 4px 0;
`;

const StatChange = styled.span<{ $positive?: boolean }>`
  font-size: 13px;
  color: ${({ $positive }) => ($positive ? '#059669' : '#dc2626')};
`;

const ChartSection = styled.div`
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  padding: 24px;
  margin-bottom: 24px;
`;

const ChartHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const ChartTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: #000000;
  margin: 0;
`;


const ChartBars = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 8px;
  height: 200px;
  padding: 0 20px;
`;

const ChartBar = styled.div<{ $height: number }>`
  flex: 1;
  height: ${({ $height }) => $height}%;
  background: linear-gradient(180deg, #000000 0%, #333333 100%);
  border-radius: 4px 4px 0 0;
  min-width: 20px;
  transition: height 0.3s;
`;

const ChartLabels = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 20px 0;
  font-size: 11px;
  color: #999999;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const TableCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  overflow: hidden;
`;

const TableHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #eaeaea;
`;

const TableTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #000000;
  margin: 0;
`;

const TableRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 24px;
  border-bottom: 1px solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }
`;

const TablePage = styled.span`
  font-size: 14px;
  color: #333333;
`;

const TableValue = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #000000;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 24px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
`;

const EmptyIcon = styled.div`
  color: #cccccc; display: flex; justify-content: center; svg { width: 64px; height: 64px; }
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

const DemoButton = styled.button`
  padding: 10px 20px;
  background: #000000;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background: #333333;
  }
`;

const mockData = {
  visitors: 12453,
  pageViews: 34221,
  bandwidth: 2.4,
  avgDuration: '2m 34s',
  chartData: [45, 62, 78, 55, 89, 92, 75],
  topPages: [
    { page: '/', views: 8432 },
    { page: '/about', views: 3211 },
    { page: '/projects', views: 2876 },
    { page: '/contact', views: 1543 },
    { page: '/blog', views: 987 },
  ],
  topReferrers: [
    { source: 'Google', visits: 5621 },
    { source: 'Twitter', visits: 2341 },
    { source: 'Direct', visits: 1987 },
    { source: 'GitHub', visits: 1234 },
    { source: 'LinkedIn', visits: 876 },
  ],
};

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showMock, setShowMock] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/dashboard/analytics');
    }
  }, [status, router]);

  if (status === 'loading' || !session) {
    return null;
  }

  return (
    <DashboardLayout>
      <PageHeader>
        <Title>Analytics</Title>
        <div style={{ display: 'flex', gap: '12px' }}>
          <DateRange>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </DateRange>
          <DemoButton onClick={() => setShowMock(!showMock)}>
            {showMock ? 'Clear Demo' : 'Show Demo'}
          </DemoButton>
        </div>
      </PageHeader>

      {!showMock ? (
        <EmptyState>
          <EmptyIcon>{Icons.analytics}</EmptyIcon>
          <EmptyTitle>No analytics data yet</EmptyTitle>
          <EmptyText>Deploy a project to start seeing analytics</EmptyText>
          <DemoButton onClick={() => setShowMock(true)}>Show Demo Data</DemoButton>
        </EmptyState>
      ) : (
        <>
          <StatsGrid>
            <StatCard>
              <StatLabel>Total Visitors</StatLabel>
              <StatValue>{mockData.visitors.toLocaleString()}</StatValue>
              <StatChange $positive>↑ 12% vs last week</StatChange>
            </StatCard>
            <StatCard>
              <StatLabel>Page Views</StatLabel>
              <StatValue>{mockData.pageViews.toLocaleString()}</StatValue>
              <StatChange $positive>↑ 8% vs last week</StatChange>
            </StatCard>
            <StatCard>
              <StatLabel>Bandwidth Used</StatLabel>
              <StatValue>{mockData.bandwidth} GB</StatValue>
              <StatChange>→ Same as last week</StatChange>
            </StatCard>
            <StatCard>
              <StatLabel>Avg. Session</StatLabel>
              <StatValue>{mockData.avgDuration}</StatValue>
              <StatChange $positive>↑ 15% vs last week</StatChange>
            </StatCard>
          </StatsGrid>

          <ChartSection>
            <ChartHeader>
              <ChartTitle>Visitors Over Time</ChartTitle>
            </ChartHeader>
            <ChartBars>
              {mockData.chartData.map((value, i) => (
                <ChartBar key={i} $height={value} />
              ))}
            </ChartBars>
            <ChartLabels>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </ChartLabels>
          </ChartSection>

          <Grid>
            <TableCard>
              <TableHeader>
                <TableTitle>Top Pages</TableTitle>
              </TableHeader>
              {mockData.topPages.map((page) => (
                <TableRow key={page.page}>
                  <TablePage>{page.page}</TablePage>
                  <TableValue>{page.views.toLocaleString()}</TableValue>
                </TableRow>
              ))}
            </TableCard>

            <TableCard>
              <TableHeader>
                <TableTitle>Top Referrers</TableTitle>
              </TableHeader>
              {mockData.topReferrers.map((ref) => (
                <TableRow key={ref.source}>
                  <TablePage>{ref.source}</TablePage>
                  <TableValue>{ref.visits.toLocaleString()}</TableValue>
                </TableRow>
              ))}
            </TableCard>
          </Grid>
        </>
      )}
    </DashboardLayout>
  );
}
