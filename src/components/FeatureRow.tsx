'use client';

import styled from 'styled-components';
import { PlanFeature } from '@/lib/plans';

const Row = styled.tr`
  &:nth-child(even) {
    background: #fafafa;
  }
`;

const FeatureName = styled.td`
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #333333;
  text-align: left;
  border-bottom: 1px solid #eaeaea;
`;

const FeatureValue = styled.td`
  padding: 12px 16px;
  font-size: 14px;
  color: #666666;
  text-align: center;
  border-bottom: 1px solid #eaeaea;
`;

interface FeatureRowProps {
  feature: PlanFeature;
}

export default function FeatureRow({ feature }: FeatureRowProps) {
  return (
    <Row>
      <FeatureName>{feature.name}</FeatureName>
      {feature.values.map((value, index) => (
        <FeatureValue key={index}>{value}</FeatureValue>
      ))}
    </Row>
  );
}
