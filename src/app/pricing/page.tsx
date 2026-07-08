'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import Header from '@/components/Header';
import CurrencyToggle from '@/components/CurrencyToggle';
import PlanCard from '@/components/PlanCard';
import PricingTable from '@/components/PricingTable';
import { plans, Plan } from '@/lib/plans';
import { Currency } from '@/lib/currency';

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #fafafa;
`;

const Main = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 24px;
`;

const HeroSection = styled.section`
  text-align: center;
  margin-bottom: 48px;
`;

const Title = styled.h1`
  font-size: 42px;
  font-weight: 700;
  color: #000000;
  margin: 0 0 16px 0;
  letter-spacing: -1px;

  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

const Subtitle = styled.p`
  font-size: 18px;
  color: #666666;
  margin: 0 0 32px 0;
`;

const PlansGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 48px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
  }
`;

const TableSection = styled.section`
  margin-top: 64px;
`;

const TableTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #000000;
  text-align: center;
  margin-bottom: 24px;
`;

export default function PricingPage() {
  const router = useRouter();
  const [currency, setCurrency] = useState<Currency>('USD');

  const handleSelectPlan = (plan: Plan) => {
    router.push(`/checkout?plan=${plan.id}&currency=${currency}`);
  };

  return (
    <PageWrapper>
      <Header />
      <Main>
        <HeroSection>
          <Title>Choose Your Hosting Plan</Title>
          <Subtitle>Simple, transparent pricing. No hidden fees.</Subtitle>
          <CurrencyToggle currency={currency} onToggle={setCurrency} />
        </HeroSection>

        <PlansGrid>
          {plans.map((plan, index) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              planIndex={index}
              currency={currency}
              onSelect={handleSelectPlan}
            />
          ))}
        </PlansGrid>

        <TableSection>
          <TableTitle>Full Feature Comparison</TableTitle>
          <PricingTable currency={currency} />
        </TableSection>
      </Main>
    </PageWrapper>
  );
}
