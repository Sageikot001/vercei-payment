'use client';

import styled from 'styled-components';
import { plans, features, BillingPeriod, calculateTotal } from '@/lib/plans';
import { formatPrice } from '@/lib/currency';
import FeatureRow from './FeatureRow';

const TableWrapper = styled.div`
  overflow-x: auto;
  margin-top: 48px;
`;

const Table = styled.table`
  width: 100%;
  min-width: 600px;
  border-collapse: collapse;
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const TableHead = styled.thead`
  background: #000000;
  color: #ffffff;
`;

const HeaderCell = styled.th`
  padding: 16px;
  font-size: 14px;
  font-weight: 600;
  text-align: center;

  &:first-child {
    text-align: left;
  }
`;

const PlanHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const PlanName = styled.span`
  font-size: 16px;
`;

const PlanPrice = styled.span`
  font-size: 13px;
  opacity: 0.8;
`;

interface PricingTableProps {
  billingPeriod: BillingPeriod;
  currency: string;
}

export default function PricingTable({ billingPeriod, currency }: PricingTableProps) {
  return (
    <TableWrapper>
      <Table>
        <TableHead>
          <tr>
            <HeaderCell>Feature</HeaderCell>
            {plans.map((plan) => (
              <HeaderCell key={plan.id}>
                <PlanHeader>
                  <PlanName>{plan.name}</PlanName>
                  <PlanPrice>{formatPrice(calculateTotal(plan, billingPeriod), currency)}</PlanPrice>
                </PlanHeader>
              </HeaderCell>
            ))}
          </tr>
        </TableHead>
        <tbody>
          {features.map((feature) => (
            <FeatureRow key={feature.name} feature={feature} />
          ))}
        </tbody>
      </Table>
    </TableWrapper>
  );
}
