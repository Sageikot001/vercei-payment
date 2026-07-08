'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styled from 'styled-components';
import Header from '@/components/Header';
import Link from 'next/link';

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #fafafa;
`;

const Main = styled.main`
  max-width: 500px;
  margin: 0 auto;
  padding: 48px 24px;
  text-align: center;
`;

const SuccessCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 48px 32px;
`;

const SuccessIcon = styled.div`
  width: 72px;
  height: 72px;
  background: #d1fae5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  font-size: 36px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #000000;
  margin: 0 0 12px 0;
`;

const Message = styled.p`
  font-size: 16px;
  color: #666666;
  margin: 0 0 24px 0;
  line-height: 1.5;
`;

const ReferenceBox = styled.div`
  background: #fafafa;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 32px;
`;

const ReferenceLabel = styled.p`
  font-size: 12px;
  color: #666666;
  margin: 0 0 4px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ReferenceValue = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: #000000;
  margin: 0;
  font-family: monospace;
`;

const DashboardButton = styled(Link)`
  display: inline-block;
  padding: 14px 32px;
  background: #000000;
  color: #ffffff;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s;

  &:hover {
    background: #333333;
  }
`;

const SupportLink = styled.p`
  margin-top: 24px;
  font-size: 14px;
  color: #666666;

  a {
    color: #0070f3;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorCard = styled(SuccessCard)`
  border: 2px solid #fecaca;
`;

const ErrorIcon = styled(SuccessIcon)`
  background: #fee2e2;
`;

function SuccessContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference') || searchParams.get('trxref');

  if (!reference) {
    return (
      <PageWrapper>
        <Header />
        <Main>
          <ErrorCard>
            <ErrorIcon>❌</ErrorIcon>
            <Title>Payment Not Found</Title>
            <Message>
              We couldn&apos;t find your payment details. If you completed a payment,
              please contact support with your transaction details.
            </Message>
            <DashboardButton href="/pricing">Back to Pricing</DashboardButton>
          </ErrorCard>
        </Main>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Header />
      <Main>
        <SuccessCard>
          <SuccessIcon>✓</SuccessIcon>
          <Title>Payment Successful!</Title>
          <Message>
            Thank you for your purchase. Your hosting plan is now active.
            You&apos;ll receive a confirmation email shortly.
          </Message>
          <ReferenceBox>
            <ReferenceLabel>Transaction Reference</ReferenceLabel>
            <ReferenceValue>{reference}</ReferenceValue>
          </ReferenceBox>
          <DashboardButton href="/dashboard">Go to Dashboard</DashboardButton>
          <SupportLink>
            Need help? <a href="mailto:support@VerceI.com">Contact Support</a>
          </SupportLink>
        </SuccessCard>
      </Main>
    </PageWrapper>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
