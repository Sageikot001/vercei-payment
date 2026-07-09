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

const FilterGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const FilterSelect = styled.select`
  padding: 8px 16px;
  border: 1px solid #eaeaea;
  border-radius: 6px;
  font-size: 14px;
  background: #ffffff;
  cursor: pointer;
`;

const DeploymentList = styled.div`
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  overflow: hidden;
`;

const DeploymentItem = styled.div`
  display: flex;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f5f5f5;
  gap: 16px;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #fafafa;
  }
`;

const StatusIndicator = styled.div<{ $status: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ $status }) =>
    $status === 'success' ? '#22c55e' :
    $status === 'building' ? '#f59e0b' :
    $status === 'failed' ? '#ef4444' :
    '#999999'
  };
`;

const DeploymentInfo = styled.div`
  flex: 1;
`;

const DeploymentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 4px;
`;

const ProjectName = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: #000000;
`;

const Branch = styled.span`
  font-size: 13px;
  color: #666666;
  background: #f5f5f5;
  padding: 2px 8px;
  border-radius: 4px;
`;

const CommitInfo = styled.p`
  font-size: 13px;
  color: #666666;
  margin: 0;
`;

const DeploymentMeta = styled.div`
  text-align: right;
`;

const DeploymentTime = styled.p`
  font-size: 13px;
  color: #333333;
  margin: 0 0 4px 0;
`;

const DeploymentDuration = styled.p`
  font-size: 12px;
  color: #999999;
  margin: 0;
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  background: #f5f5f5;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  color: #333333;
  cursor: pointer;
  transition: background 0.2s;

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
  margin: 0;
`;

const mockDeployments = [
  {
    id: '1',
    project: 'portfolio-site',
    branch: 'main',
    commit: 'Update hero section copy',
    status: 'success',
    time: '2 hours ago',
    duration: '45s',
  },
  {
    id: '2',
    project: 'portfolio-site',
    branch: 'feature/contact',
    commit: 'Add contact form validation',
    status: 'success',
    time: '5 hours ago',
    duration: '1m 12s',
  },
  {
    id: '3',
    project: 'e-commerce-store',
    branch: 'main',
    commit: 'Fix checkout bug',
    status: 'success',
    time: '1 day ago',
    duration: '2m 5s',
  },
  {
    id: '4',
    project: 'blog-platform',
    branch: 'main',
    commit: 'Add dark mode support',
    status: 'building',
    time: 'Just now',
    duration: '...',
  },
];

export default function DeploymentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showMock, setShowMock] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/dashboard/deployments');
    }
  }, [status, router]);

  if (status === 'loading' || !session) {
    return null;
  }

  const deployments = showMock ? mockDeployments : [];

  return (
    <DashboardLayout>
      <PageHeader>
        <Title>Deployments</Title>
        <FilterGroup>
          <FilterSelect>
            <option>All Projects</option>
          </FilterSelect>
          <FilterSelect>
            <option>All Branches</option>
          </FilterSelect>
          <ActionButton onClick={() => setShowMock(!showMock)}>
            {showMock ? 'Clear Demo' : 'Show Demo'}
          </ActionButton>
        </FilterGroup>
      </PageHeader>

      {deployments.length === 0 ? (
        <EmptyState>
          <EmptyIcon>{Icons.deployments}</EmptyIcon>
          <EmptyTitle>No deployments yet</EmptyTitle>
          <EmptyText>Your deployment history will appear here</EmptyText>
        </EmptyState>
      ) : (
        <DeploymentList>
          {deployments.map((deployment) => (
            <DeploymentItem key={deployment.id}>
              <StatusIndicator $status={deployment.status} />
              <DeploymentInfo>
                <DeploymentHeader>
                  <ProjectName>{deployment.project}</ProjectName>
                  <Branch>{deployment.branch}</Branch>
                </DeploymentHeader>
                <CommitInfo>{deployment.commit}</CommitInfo>
              </DeploymentInfo>
              <DeploymentMeta>
                <DeploymentTime>{deployment.time}</DeploymentTime>
                <DeploymentDuration>{deployment.duration}</DeploymentDuration>
              </DeploymentMeta>
              <ActionButton>View Logs</ActionButton>
            </DeploymentItem>
          ))}
        </DeploymentList>
      )}
    </DashboardLayout>
  );
}
