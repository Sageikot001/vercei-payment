'use client';

import styled from 'styled-components';
import Header from '@/components/Header';
import Sidebar from './Sidebar';

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #fafafa;
`;

const MainContent = styled.main`
  margin-left: 240px;
  padding: 32px;
  min-height: calc(100vh - 65px);

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 24px;
  }
`;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <PageWrapper>
      <Header />
      <Sidebar />
      <MainContent>{children}</MainContent>
    </PageWrapper>
  );
}
