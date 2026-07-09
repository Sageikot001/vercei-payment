'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const PageHeader = styled.div`
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #000000;
  margin: 0 0 8px 0;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #666666;
  margin: 0;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;

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
  padding: 20px 24px;
  border-bottom: 1px solid #eaeaea;
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

const PlanCard = styled(Card)`
  border: 2px solid #000000;
`;

const PlanBadge = styled.span`
  display: inline-block;
  padding: 4px 10px;
  background: #000000;
  color: #ffffff;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  border-radius: 4px;
  margin-bottom: 16px;
`;

const NoPlanBadge = styled(PlanBadge)`
  background: #f5f5f5;
  color: #666666;
`;

const PlanName = styled.h3`
  font-size: 28px;
  font-weight: 700;
  color: #000000;
  margin: 0 0 8px 0;
`;

const PlanPrice = styled.p`
  font-size: 14px;
  color: #666666;
  margin: 0 0 20px 0;
`;

const PlanFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 24px 0;
`;

const PlanFeature = styled.li`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  font-size: 14px;
  color: #333333;

  &::before {
    content: '✓';
    color: #059669;
    font-weight: 600;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const PrimaryButton = styled(Link)`
  flex: 1;
  padding: 12px 20px;
  background: #000000;
  color: #ffffff;
  text-decoration: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  transition: background 0.2s;

  &:hover {
    background: #333333;
  }
`;

const SecondaryButton = styled.button`
  padding: 12px 20px;
  background: #ffffff;
  color: #000000;
  border: 2px solid #eaeaea;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.2s;

  &:hover {
    border-color: #000000;
  }
`;

const UsageSection = styled.div`
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const UsageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const UsageLabel = styled.span`
  font-size: 14px;
  color: #333333;
`;

const UsageValue = styled.span`
  font-size: 14px;
  color: #666666;
`;

const UsageBar = styled.div`
  height: 8px;
  background: #f5f5f5;
  border-radius: 4px;
  overflow: hidden;
`;

const UsageProgress = styled.div<{ $percent: number; $warning?: boolean }>`
  height: 100%;
  width: ${({ $percent }) => $percent}%;
  background: ${({ $warning }) => ($warning ? '#f59e0b' : '#000000')};
  border-radius: 4px;
  transition: width 0.3s;
`;

const InvoiceTable = styled.div`
  border: 1px solid #eaeaea;
  border-radius: 8px;
  overflow: hidden;
`;

const InvoiceRow = styled.div<{ $header?: boolean }>`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 100px;
  padding: 12px 16px;
  background: ${({ $header }) => ($header ? '#f9f9f9' : '#ffffff')};
  border-bottom: 1px solid #eaeaea;
  font-size: 13px;
  font-weight: ${({ $header }) => ($header ? '600' : '400')};
  color: ${({ $header }) => ($header ? '#666666' : '#333333')};

  &:last-child {
    border-bottom: none;
  }
`;

const InvoiceStatus = styled.span<{ $status: string }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  background: ${({ $status }) =>
    $status === 'paid' ? '#dcfce7' : '#fee2e2'
  };
  color: ${({ $status }) =>
    $status === 'paid' ? '#166534' : '#991b1b'
  };
`;

const EmptyInvoices = styled.div`
  padding: 32px;
  text-align: center;
  color: #666666;
  font-size: 14px;
`;






const NoPayment = styled.p`
  font-size: 14px;
  color: #666666;
  margin: 0;
`;

export default function BillingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/dashboard/billing');
    }
  }, [status, router]);

  if (status === 'loading' || !session) {
    return null;
  }

  // Mock data - in production this would come from your backend
  const hasActivePlan = false;
  const currentPlan = hasActivePlan ? {
    name: 'Standard',
    price: '$8/mo',
    billing: 'Yearly',
    features: ['10 GB Storage', '3 Custom Domains', '500 GB Bandwidth', '1,000 Build Minutes'],
  } : null;

  const usage = {
    storage: { used: 0, total: 5, unit: 'GB' },
    bandwidth: { used: 0, total: 100, unit: 'GB' },
    buildMinutes: { used: 0, total: 300, unit: 'min' },
  };

  const invoices: { date: string; amount: string; status: string }[] = [];

  return (
    <DashboardLayout>
      <PageHeader>
        <Title>Billing</Title>
        <Subtitle>Manage your subscription and payment methods</Subtitle>
      </PageHeader>

      <Grid>
        <PlanCard>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
          </CardHeader>
          <CardContent>
            {currentPlan ? (
              <>
                <PlanBadge>{currentPlan.billing}</PlanBadge>
                <PlanName>{currentPlan.name}</PlanName>
                <PlanPrice>{currentPlan.price} billed {currentPlan.billing.toLowerCase()}</PlanPrice>
                <PlanFeatures>
                  {currentPlan.features.map((feature) => (
                    <PlanFeature key={feature}>{feature}</PlanFeature>
                  ))}
                </PlanFeatures>
                <ButtonGroup>
                  <PrimaryButton href="/pricing">Upgrade Plan</PrimaryButton>
                  <SecondaryButton>Cancel</SecondaryButton>
                </ButtonGroup>
              </>
            ) : (
              <>
                <NoPlanBadge>No Active Plan</NoPlanBadge>
                <PlanName>Free Tier</PlanName>
                <PlanPrice>Limited features</PlanPrice>
                <PlanFeatures>
                  <PlanFeature>1 Project</PlanFeature>
                  <PlanFeature>100 MB Storage</PlanFeature>
                  <PlanFeature>1 GB Bandwidth</PlanFeature>
                </PlanFeatures>
                <PrimaryButton href="/pricing">Choose a Plan</PrimaryButton>
              </>
            )}
          </CardContent>
        </PlanCard>

        <Card>
          <CardHeader>
            <CardTitle>Usage This Period</CardTitle>
          </CardHeader>
          <CardContent>
            <UsageSection>
              <UsageHeader>
                <UsageLabel>Storage</UsageLabel>
                <UsageValue>{usage.storage.used} / {usage.storage.total} {usage.storage.unit}</UsageValue>
              </UsageHeader>
              <UsageBar>
                <UsageProgress $percent={(usage.storage.used / usage.storage.total) * 100} />
              </UsageBar>
            </UsageSection>

            <UsageSection>
              <UsageHeader>
                <UsageLabel>Bandwidth</UsageLabel>
                <UsageValue>{usage.bandwidth.used} / {usage.bandwidth.total} {usage.bandwidth.unit}</UsageValue>
              </UsageHeader>
              <UsageBar>
                <UsageProgress $percent={(usage.bandwidth.used / usage.bandwidth.total) * 100} />
              </UsageBar>
            </UsageSection>

            <UsageSection>
              <UsageHeader>
                <UsageLabel>Build Minutes</UsageLabel>
                <UsageValue>{usage.buildMinutes.used} / {usage.buildMinutes.total} {usage.buildMinutes.unit}</UsageValue>
              </UsageHeader>
              <UsageBar>
                <UsageProgress $percent={(usage.buildMinutes.used / usage.buildMinutes.total) * 100} />
              </UsageBar>
            </UsageSection>
          </CardContent>
        </Card>
      </Grid>

      <Grid>
        <Card>
          <CardHeader>
            <CardTitle>Invoice History</CardTitle>
          </CardHeader>
          {invoices.length > 0 ? (
            <InvoiceTable>
              <InvoiceRow $header>
                <span>Date</span>
                <span>Amount</span>
                <span>Status</span>
                <span></span>
              </InvoiceRow>
              {invoices.map((invoice, i) => (
                <InvoiceRow key={i}>
                  <span>{invoice.date}</span>
                  <span>{invoice.amount}</span>
                  <span>
                    <InvoiceStatus $status={invoice.status}>{invoice.status}</InvoiceStatus>
                  </span>
                  <span>
                    <Link href="#">Download</Link>
                  </span>
                </InvoiceRow>
              ))}
            </InvoiceTable>
          ) : (
            <EmptyInvoices>No invoices yet</EmptyInvoices>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <NoPayment>No payment method on file. Add one when you subscribe to a plan.</NoPayment>
          </CardContent>
        </Card>
      </Grid>
    </DashboardLayout>
  );
}
