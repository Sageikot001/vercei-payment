'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import styled from 'styled-components';
import Header from '@/components/Header';
import { getPlanById, getBillingPeriod, calculateTotal, features, Plan, BillingPeriod } from '@/lib/plans';
import { formatPrice } from '@/lib/currency';

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #fafafa;
`;

const Main = styled.main`
  max-width: 600px;
  margin: 0 auto;
  padding: 48px 24px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #000000;
  margin: 0 0 32px 0;
  text-align: center;
`;

const CheckoutCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
`;

const PlanSummary = styled.div`
  padding: 24px;
  border-bottom: 1px solid #eaeaea;
`;

const PlanName = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 8px 0;
`;

const BillingInfo = styled.p`
  font-size: 14px;
  color: #666666;
  margin: 0 0 16px 0;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FeatureItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 14px;
  color: #666666;
  border-bottom: 1px solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }
`;

const TotalSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #fafafa;
  border-bottom: 1px solid #eaeaea;
`;

const TotalLabel = styled.span`
  font-size: 16px;
  font-weight: 600;
`;

const TotalPrice = styled.span`
  font-size: 24px;
  font-weight: 700;
`;

const FormSection = styled.div`
  padding: 24px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333333;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #eaeaea;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #000000;
  }

  &::placeholder {
    color: #999999;
  }
`;

const PayButton = styled.button`
  width: 100%;
  padding: 16px;
  margin-top: 24px;
  background: #000000;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: #333333;
  }

  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
`;

const SecurityBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
  font-size: 13px;
  color: #666666;
`;

const ErrorMessage = styled.p`
  color: #ee0000;
  font-size: 14px;
  margin-top: 8px;
`;

const BackLink = styled.a`
  display: block;
  text-align: center;
  margin-top: 24px;
  color: #666666;
  font-size: 14px;
  text-decoration: none;

  &:hover {
    color: #000000;
  }
`;

function CheckoutContent() {
  const searchParams = useSearchParams();
  const planId = searchParams.get('plan');
  const billingParam = searchParams.get('billing') as BillingPeriod | null;
  const currencyParam = searchParams.get('currency');

  const [plan, setPlan] = useState<Plan | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('24-months');
  const [currency, setCurrency] = useState('USD');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (planId) {
      const foundPlan = getPlanById(planId);
      setPlan(foundPlan || null);
    }
    if (billingParam) {
      setBillingPeriod(billingParam);
    }
    if (currencyParam) {
      setCurrency(currencyParam);
    }
  }, [planId, billingParam, currencyParam]);

  const planIndex = plan ? (plan.id === 'basic' ? 0 : plan.id === 'standard' ? 1 : 2) : 0;
  const planFeatures = plan
    ? features.slice(0, 6).map((f) => ({
        name: f.name,
        value: f.values[planIndex],
      }))
    : [];

  const period = getBillingPeriod(billingPeriod);
  const totalPrice = plan ? calculateTotal(plan, billingPeriod) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plan || !email) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          planId: plan.id,
          billingPeriod,
          currency,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initialize payment');
      }

      window.location.href = data.authorization_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(false);
    }
  };

  if (!plan) {
    return (
      <PageWrapper>
        <Header />
        <Main>
          <Title>Plan not found</Title>
          <BackLink href="/pricing">← Back to pricing</BackLink>
        </Main>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Header />
      <Main>
        <Title>Complete Your Purchase</Title>
        <CheckoutCard>
          <PlanSummary>
            <PlanName>{plan.name} Plan</PlanName>
            <BillingInfo>{period?.label} billing ({formatPrice(plan.pricing[billingPeriod], currency)}/mo)</BillingInfo>
            <FeatureList>
              {planFeatures.map((feature) => (
                <FeatureItem key={feature.name}>
                  <span>{feature.name}</span>
                  <span>{feature.value}</span>
                </FeatureItem>
              ))}
            </FeatureList>
          </PlanSummary>

          <TotalSection>
            <TotalLabel>Total ({period?.months} months)</TotalLabel>
            <TotalPrice>{formatPrice(totalPrice, currency)}</TotalPrice>
          </TotalSection>

          <FormSection>
            <form onSubmit={handleSubmit}>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {error && <ErrorMessage>{error}</ErrorMessage>}
              <PayButton type="submit" disabled={loading || !email}>
                {loading ? 'Redirecting...' : 'Pay with Paystack'}
              </PayButton>
            </form>
            <SecurityBadge>🔒 Secured by Paystack</SecurityBadge>
          </FormSection>
        </CheckoutCard>
        <BackLink href="/pricing">← Back to pricing</BackLink>
      </Main>
    </PageWrapper>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
