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

const ProjectTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ProjectIcon = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
`;

const TitleContent = styled.div``;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #000000;
  margin: 0 0 4px 0;
`;

const ProjectUrl = styled.a`
  font-size: 14px;
  color: #0070f3;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
`;

const SecondaryButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #ffffff;
  color: #333333;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    border-color: #000000;
  }
`;

const PrimaryButton = styled.button`
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

const TabsContainer = styled.div`
  display: flex;
  gap: 4px;
  border-bottom: 1px solid #eaeaea;
  margin-bottom: 24px;
  overflow-x: auto;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 12px 20px;
  background: none;
  border: none;
  border-bottom: 2px solid ${({ $active }) => ($active ? '#000000' : 'transparent')};
  color: ${({ $active }) => ($active ? '#000000' : '#666666')};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    color: #000000;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  overflow: hidden;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #f5f5f5;
`;

const CardTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: #000000;
  margin: 0;
`;

const CardContent = styled.div`
  padding: 24px;
`;

const DeploymentList = styled.div``;

const DeploymentItem = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 0;
  gap: 12px;
  border-bottom: 1px solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }
`;

const StatusDot = styled.div<{ $status: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $status }) =>
    $status === 'ready' ? '#22c55e' :
    $status === 'building' ? '#f59e0b' :
    '#ef4444'
  };
`;

const DeploymentInfo = styled.div`
  flex: 1;
`;

const DeploymentCommit = styled.p`
  font-size: 14px;
  color: #000000;
  margin: 0 0 2px 0;
`;

const DeploymentMeta = styled.p`
  font-size: 12px;
  color: #666666;
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

const InfoGrid = styled.div`
  display: grid;
  gap: 16px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.span`
  font-size: 13px;
  color: #666666;
`;

const InfoValue = styled.span`
  font-size: 13px;
  color: #000000;
  font-weight: 500;
`;

const DomainList = styled.div``;

const DomainItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }
`;

const DomainName = styled.span`
  font-size: 14px;
  color: #000000;
`;

const DomainBadge = styled.span<{ $primary?: boolean }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  background: ${({ $primary }) => ($primary ? '#dcfce7' : '#f5f5f5')};
  color: ${({ $primary }) => ($primary ? '#166534' : '#666666')};
`;

const ViewAllLink = styled(Link)`
  font-size: 13px;
  color: #0070f3;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const SuccessBanner = styled.div`
  background: #dcfce7;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  padding: 16px 20px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BannerIcon = styled.div`
  color: #166534;
`;

const BannerContent = styled.div`
  flex: 1;
`;

const BannerTitle = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: #166534;
  margin: 0 0 2px 0;
`;

const BannerText = styled.p`
  font-size: 13px;
  color: #15803d;
  margin: 0;
`;

const mockDeployments = [
  {
    id: '1',
    commit: 'Update hero section copy',
    branch: 'main',
    time: '2 hours ago',
    status: 'ready',
    type: 'production',
  },
  {
    id: '2',
    commit: 'Add contact form validation',
    branch: 'feature/contact',
    time: '5 hours ago',
    status: 'ready',
    type: 'preview',
  },
  {
    id: '3',
    commit: 'Fix mobile navigation',
    branch: 'main',
    time: '1 day ago',
    status: 'ready',
    type: 'production',
  },
];

const mockDomains = [
  { domain: 'my-project.vercei.app', primary: true },
  { domain: 'myproject.com', primary: false },
  { domain: 'www.myproject.com', primary: false },
];

export default function ProjectDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [activeTab, setActiveTab] = useState('deployments');
  const [showSuccess, setShowSuccess] = useState(false);

  const projectId = params.id as string;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/login?callbackUrl=/dashboard/projects/${projectId}`);
    }
  }, [status, router, projectId]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('new') === 'true') {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, []);

  if (status === 'loading' || !session) {
    return null;
  }

  return (
    <DashboardLayout>
      <PageHeader>
        <BackLink href="/dashboard/projects">← Back to Projects</BackLink>

        {showSuccess && (
          <SuccessBanner>
            <BannerIcon>{Icons.check}</BannerIcon>
            <BannerContent>
              <BannerTitle>Deployment Started</BannerTitle>
              <BannerText>Your project is being built and will be live shortly.</BannerText>
            </BannerContent>
          </SuccessBanner>
        )}

        <HeaderRow>
          <ProjectTitle>
            <ProjectIcon>{Icons.globe}</ProjectIcon>
            <TitleContent>
              <Title>{projectId}</Title>
              <ProjectUrl href={`https://${projectId}.vercei.app`} target="_blank">
                {projectId}.vercei.app
              </ProjectUrl>
            </TitleContent>
          </ProjectTitle>
          <HeaderActions>
            <SecondaryButton onClick={() => router.push(`/dashboard/projects/${projectId}/settings`)}>
              {Icons.settings} Settings
            </SecondaryButton>
            <PrimaryButton>
              {Icons.refresh} Redeploy
            </PrimaryButton>
          </HeaderActions>
        </HeaderRow>
      </PageHeader>

      <TabsContainer>
        <Tab $active={activeTab === 'deployments'} onClick={() => setActiveTab('deployments')}>
          Deployments
        </Tab>
        <Tab $active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')}>
          Analytics
        </Tab>
        <Tab $active={activeTab === 'logs'} onClick={() => setActiveTab('logs')}>
          Logs
        </Tab>
        <Tab $active={activeTab === 'settings'} onClick={() => router.push(`/dashboard/projects/${projectId}/settings`)}>
          Settings
        </Tab>
      </TabsContainer>

      <Grid>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Deployments</CardTitle>
              <ViewAllLink href={`/dashboard/projects/${projectId}/deployments`}>View All</ViewAllLink>
            </CardHeader>
            <CardContent>
              <DeploymentList>
                {mockDeployments.map((deployment) => (
                  <DeploymentItem key={deployment.id}>
                    <StatusDot $status={deployment.status} />
                    <DeploymentInfo>
                      <DeploymentCommit>{deployment.commit}</DeploymentCommit>
                      <DeploymentMeta>{deployment.branch} • {deployment.time}</DeploymentMeta>
                    </DeploymentInfo>
                    <DeploymentBadge $type={deployment.type}>
                      {deployment.type}
                    </DeploymentBadge>
                  </DeploymentItem>
                ))}
              </DeploymentList>
            </CardContent>
          </Card>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Card>
            <CardHeader>
              <CardTitle>Project Info</CardTitle>
            </CardHeader>
            <CardContent>
              <InfoGrid>
                <InfoRow>
                  <InfoLabel>Framework</InfoLabel>
                  <InfoValue>Next.js</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>Region</InfoLabel>
                  <InfoValue>Global (Edge)</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>Created</InfoLabel>
                  <InfoValue>Jan 15, 2024</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>Last Deploy</InfoLabel>
                  <InfoValue>2 hours ago</InfoValue>
                </InfoRow>
              </InfoGrid>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Domains</CardTitle>
              <ViewAllLink href={`/dashboard/projects/${projectId}/settings`}>Manage</ViewAllLink>
            </CardHeader>
            <CardContent>
              <DomainList>
                {mockDomains.map((domain, idx) => (
                  <DomainItem key={idx}>
                    <DomainName>{domain.domain}</DomainName>
                    {domain.primary && <DomainBadge $primary>Primary</DomainBadge>}
                  </DomainItem>
                ))}
              </DomainList>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Git Repository</CardTitle>
            </CardHeader>
            <CardContent>
              <InfoGrid>
                <InfoRow>
                  <InfoLabel>Repository</InfoLabel>
                  <InfoValue style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {Icons.code} user/{projectId}
                  </InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>Branch</InfoLabel>
                  <InfoValue>main</InfoValue>
                </InfoRow>
              </InfoGrid>
            </CardContent>
          </Card>
        </div>
      </Grid>
    </DashboardLayout>
  );
}
