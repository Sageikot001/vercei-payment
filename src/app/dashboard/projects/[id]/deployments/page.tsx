'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Icons } from '@/components/icons';

const PageHeader = styled.div`
  margin-bottom: 32px;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666666;
  text-decoration: none;
  margin-bottom: 16px;

  &:hover {
    color: #000000;
  }
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
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
  padding: 10px 16px;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  font-size: 14px;
  background: #ffffff;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #000000;
  }
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  overflow: hidden;
`;

const DeploymentItem = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 20px 24px;
  gap: 16px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  transition: background 0.15s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #fafafa;
  }
`;

const StatusColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding-top: 4px;
`;

const StatusDot = styled.div<{ $status: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ $status }) =>
    $status === 'ready' ? '#22c55e' :
    $status === 'building' ? '#f59e0b' :
    $status === 'error' ? '#ef4444' :
    '#999999'
  };
`;

const StatusLine = styled.div`
  width: 2px;
  height: 40px;
  background: #eaeaea;
`;

const DeploymentContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const DeploymentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  flex-wrap: wrap;
`;

const DeploymentTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: #000000;
  margin: 0;
`;

const DeploymentBadge = styled.span<{ $type: string }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  background: ${({ $type }) => ($type === 'production' ? '#000000' : '#f5f5f5')};
  color: ${({ $type }) => ($type === 'production' ? '#ffffff' : '#666666')};
`;

const BranchBadge = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 11px;
  color: #666666;
`;

const CommitMessage = styled.p`
  font-size: 14px;
  color: #333333;
  margin: 0 0 8px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DeploymentMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 12px;
  color: #666666;
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const DeploymentUrl = styled.a`
  color: #0070f3;
  text-decoration: none;
  font-size: 12px;

  &:hover {
    text-decoration: underline;
  }
`;

const DeploymentActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
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
  white-space: nowrap;

  &:hover {
    background: #eaeaea;
  }
`;

const PrimaryActionButton = styled(ActionButton)`
  background: #000000;
  color: #ffffff;

  &:hover {
    background: #333333;
  }
`;

const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 24px;
  border-top: 1px solid #f5f5f5;
`;

const PageButton = styled.button<{ $active?: boolean }>`
  padding: 8px 12px;
  background: ${({ $active }) => ($active ? '#000000' : '#ffffff')};
  color: ${({ $active }) => ($active ? '#ffffff' : '#333333')};
  border: 1px solid ${({ $active }) => ($active ? '#000000' : '#eaeaea')};
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;

  &:hover {
    border-color: #000000;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const mockDeployments = [
  {
    id: '1',
    commit: 'Update hero section copy',
    commitHash: 'a3f2b1c',
    branch: 'main',
    time: '2 hours ago',
    duration: '45s',
    status: 'ready',
    type: 'production',
    url: 'my-project-abc123.vercei.app',
    author: 'John Doe',
  },
  {
    id: '2',
    commit: 'Add contact form validation with email verification',
    commitHash: 'b4e3d2a',
    branch: 'feature/contact',
    time: '5 hours ago',
    duration: '1m 12s',
    status: 'ready',
    type: 'preview',
    url: 'my-project-feature-contact-def456.vercei.app',
    author: 'Jane Smith',
  },
  {
    id: '3',
    commit: 'Fix mobile navigation responsiveness',
    commitHash: 'c5f4e3b',
    branch: 'main',
    time: '1 day ago',
    duration: '52s',
    status: 'ready',
    type: 'production',
    url: 'my-project-ghi789.vercei.app',
    author: 'John Doe',
  },
  {
    id: '4',
    commit: 'Add dark mode support',
    commitHash: 'd6g5f4c',
    branch: 'feature/dark-mode',
    time: '2 days ago',
    duration: '2m 5s',
    status: 'ready',
    type: 'preview',
    url: 'my-project-dark-mode-jkl012.vercei.app',
    author: 'Jane Smith',
  },
  {
    id: '5',
    commit: 'Implement user authentication flow',
    commitHash: 'e7h6g5d',
    branch: 'feature/auth',
    time: '3 days ago',
    duration: '1m 45s',
    status: 'error',
    type: 'preview',
    url: null,
    author: 'John Doe',
  },
  {
    id: '6',
    commit: 'Update dependencies and security patches',
    commitHash: 'f8i7h6e',
    branch: 'main',
    time: '4 days ago',
    duration: '38s',
    status: 'ready',
    type: 'production',
    url: 'my-project-mno345.vercei.app',
    author: 'Jane Smith',
  },
];

export default function ProjectDeploymentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [filter, setFilter] = useState('all');
  const [branchFilter, setBranchFilter] = useState('all');

  const projectId = params.id as string;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/login?callbackUrl=/dashboard/projects/${projectId}/deployments`);
    }
  }, [status, router, projectId]);

  if (status === 'loading' || !session) {
    return null;
  }

  const filteredDeployments = mockDeployments.filter((d) => {
    if (filter !== 'all' && d.type !== filter) return false;
    if (branchFilter !== 'all' && d.branch !== branchFilter) return false;
    return true;
  });

  const branches = Array.from(new Set(mockDeployments.map((d) => d.branch)));

  return (
    <DashboardLayout>
      <PageHeader>
        <BackLink href={`/dashboard/projects/${projectId}`}>← Back to Project</BackLink>
        <HeaderRow>
          <Title>Deployments</Title>
          <FilterGroup>
            <FilterSelect value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All Deployments</option>
              <option value="production">Production</option>
              <option value="preview">Preview</option>
            </FilterSelect>
            <FilterSelect value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)}>
              <option value="all">All Branches</option>
              {branches.map((branch) => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </FilterSelect>
          </FilterGroup>
        </HeaderRow>
      </PageHeader>

      <Card>
        {filteredDeployments.map((deployment, idx) => (
          <DeploymentItem key={deployment.id}>
            <StatusColumn>
              <StatusDot $status={deployment.status} />
              {idx < filteredDeployments.length - 1 && <StatusLine />}
            </StatusColumn>
            <DeploymentContent>
              <DeploymentHeader>
                <DeploymentTitle>{deployment.commitHash}</DeploymentTitle>
                <DeploymentBadge $type={deployment.type}>{deployment.type}</DeploymentBadge>
                <BranchBadge>{Icons.code} {deployment.branch}</BranchBadge>
              </DeploymentHeader>
              <CommitMessage>{deployment.commit}</CommitMessage>
              <DeploymentMeta>
                <MetaItem>{deployment.author}</MetaItem>
                <MetaItem>{deployment.time}</MetaItem>
                <MetaItem>{Icons.clock} {deployment.duration}</MetaItem>
                {deployment.url && (
                  <DeploymentUrl href={`https://${deployment.url}`} target="_blank" onClick={(e) => e.stopPropagation()}>
                    {deployment.url}
                  </DeploymentUrl>
                )}
              </DeploymentMeta>
            </DeploymentContent>
            <DeploymentActions>
              {deployment.status === 'ready' && (
                <>
                  <ActionButton onClick={(e) => { e.stopPropagation(); }}>
                    View Logs
                  </ActionButton>
                  {deployment.type === 'preview' && (
                    <PrimaryActionButton onClick={(e) => { e.stopPropagation(); }}>
                      Promote to Production
                    </PrimaryActionButton>
                  )}
                </>
              )}
              {deployment.status === 'error' && (
                <>
                  <ActionButton onClick={(e) => { e.stopPropagation(); }}>
                    View Logs
                  </ActionButton>
                  <PrimaryActionButton onClick={(e) => { e.stopPropagation(); }}>
                    Retry
                  </PrimaryActionButton>
                </>
              )}
            </DeploymentActions>
          </DeploymentItem>
        ))}

        <Pagination>
          <PageButton disabled>Previous</PageButton>
          <PageButton $active>1</PageButton>
          <PageButton>2</PageButton>
          <PageButton>3</PageButton>
          <PageButton>Next</PageButton>
        </Pagination>
      </Card>
    </DashboardLayout>
  );
}
