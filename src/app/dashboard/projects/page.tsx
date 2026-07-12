'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';

import { Icons } from '@/components/icons';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useProjects } from '@/hooks/useProjects';

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #000000;
  margin: 0;
`;

const CreateButton = styled(Link)`
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
  transition: background 0.2s;
  text-decoration: none;

  &:hover {
    background: #333333;
  }
`;

const ViewToggle = styled.div`
  display: flex;
  background: #f5f5f5;
  border-radius: 8px;
  padding: 4px;
  margin-bottom: 24px;
`;

const ToggleButton = styled.button<{ $active: boolean }>`
  padding: 8px 16px;
  background: ${({ $active }) => ($active ? '#ffffff' : 'transparent')};
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  color: ${({ $active }) => ($active ? '#000000' : '#666666')};
  cursor: pointer;
  box-shadow: ${({ $active }) => ($active ? '0 1px 3px rgba(0,0,0,0.1)' : 'none')};
  transition: all 0.2s;
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
`;

const ProjectCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: box-shadow 0.2s, transform 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const ProjectCardLink = styled.div`
  cursor: pointer;
`;

const ProjectPreview = styled.div`
  height: 160px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #cccccc;
  display: flex;
  justify-content: center;

  svg {
    width: 48px;
    height: 48px;
  }
`;

const ProjectInfo = styled.div`
  padding: 20px;
`;

const ProjectHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const ProjectName = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #000000;
  margin: 0;
`;

const StatusBadge = styled.span<{ $status: string }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  background: ${({ $status }) =>
    $status === 'live' ? '#dcfce7' :
    $status === 'building' ? '#fef3c7' :
    '#fee2e2'
  };
  color: ${({ $status }) =>
    $status === 'live' ? '#166534' :
    $status === 'building' ? '#92400e' :
    '#991b1b'
  };
`;

const ProjectUrl = styled.a`
  display: block;
  font-size: 13px;
  color: #0070f3;
  text-decoration: none;
  margin-bottom: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    text-decoration: underline;
  }
`;

const ProjectMeta = styled.div`
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

const ProjectActions = styled.div`
  display: flex;
  gap: 8px;
  padding: 12px 20px;
  border-top: 1px solid #f5f5f5;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 8px;
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
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
`;

const EmptyButton = styled.button`
  padding: 12px 24px;
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

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80px;
  color: #666666;
`;

export default function ProjectsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const { projects, loading, error, refetch } = useProjects();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/dashboard/projects');
    }
  }, [status, router]);

  if (status === 'loading' || !session) {
    return null;
  }

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner>Loading projects...</LoadingSpinner>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <EmptyState>
          <EmptyTitle>Error loading projects</EmptyTitle>
          <EmptyText>{error}</EmptyText>
          <EmptyButton onClick={() => refetch()}>Retry</EmptyButton>
        </EmptyState>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageHeader>
        <Title>Projects</Title>
        <CreateButton href="/dashboard/projects/new">
          {Icons.plus}
          New Project
        </CreateButton>
      </PageHeader>

      {projects.length > 0 && (
        <ViewToggle>
          <ToggleButton $active={view === 'grid'} onClick={() => setView('grid')}>
            Grid
          </ToggleButton>
          <ToggleButton $active={view === 'list'} onClick={() => setView('list')}>
            List
          </ToggleButton>
        </ViewToggle>
      )}

      {projects.length === 0 ? (
        <EmptyState>
          <EmptyIcon>{Icons.projects}</EmptyIcon>
          <EmptyTitle>No projects yet</EmptyTitle>
          <EmptyText>
            Create your first project to start deploying your websites and applications.
          </EmptyText>
          <EmptyButton onClick={() => router.push('/dashboard/projects/new')}>
            Create Your First Project
          </EmptyButton>
        </EmptyState>
      ) : (
        <ProjectsGrid>
          {projects.map((project) => (
            <ProjectCard key={project.id}>
              <ProjectCardLink
                onClick={() => router.push(`/dashboard/projects/${project.name}`)}
                role="link"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    router.push(`/dashboard/projects/${project.name}`);
                  }
                }}
              >
                <ProjectPreview>{Icons.globe}</ProjectPreview>
                <ProjectInfo>
                  <ProjectHeader>
                    <ProjectName>{project.name}</ProjectName>
                    <StatusBadge $status={project.status}>
                      {project.status}
                    </StatusBadge>
                  </ProjectHeader>
                  <ProjectUrl as="span">
                    {project.url}
                  </ProjectUrl>
                  <ProjectMeta>
                    <MetaItem>{project.lastDeployed}</MetaItem>
                    <MetaItem>{project.framework}</MetaItem>
                  </ProjectMeta>
                </ProjectInfo>
              </ProjectCardLink>
              <ProjectActions>
                <ActionButton onClick={() => window.open(`https://${project.url}`, '_blank', 'noopener,noreferrer')}>
                  Visit
                </ActionButton>
                <ActionButton disabled style={{ opacity: 0.5, cursor: 'not-allowed' }} title="Coming soon">
                  Redeploy
                </ActionButton>
                <ActionButton onClick={() => router.push(`/dashboard/projects/${project.name}/settings`)}>
                  Settings
                </ActionButton>
              </ProjectActions>
            </ProjectCard>
          ))}
        </ProjectsGrid>
      )}
    </DashboardLayout>
  );
}
