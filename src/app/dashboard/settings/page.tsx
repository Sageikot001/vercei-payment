'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
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

const Section = styled.div`
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
  overflow: hidden;
`;

const SectionHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #eaeaea;
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: #000000;
  margin: 0 0 4px 0;
`;

const SectionDesc = styled.p`
  font-size: 13px;
  color: #666666;
  margin: 0;
`;

const SectionContent = styled.div`
  padding: 24px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
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
  max-width: 400px;
  padding: 10px 14px;
  border: 1px solid #eaeaea;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #000000;
  }

  &:disabled {
    background: #f5f5f5;
    color: #666666;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

const SaveButton = styled.button`
  padding: 10px 20px;
  background: #000000;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: #333333;
  }

  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  padding: 10px 20px;
  background: #ffffff;
  color: #333333;
  border: 1px solid #eaeaea;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    border-color: #000000;
  }
`;

const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }
`;

const ToggleInfo = styled.div``;

const ToggleLabel = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: #000000;
  margin: 0 0 4px 0;
`;

const ToggleDesc = styled.p`
  font-size: 13px;
  color: #666666;
  margin: 0;
`;

const Toggle = styled.button<{ $active: boolean }>`
  width: 48px;
  height: 28px;
  border-radius: 14px;
  border: none;
  background: ${({ $active }) => ($active ? '#000000' : '#e5e5e5')};
  cursor: pointer;
  position: relative;
  transition: background 0.2s;

  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: ${({ $active }) => ($active ? '23px' : '3px')};
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #ffffff;
    transition: left 0.2s;
  }
`;

const DangerZone = styled(Section)`
  border: 1px solid #fecaca;
`;

const DangerHeader = styled(SectionHeader)`
  background: #fef2f2;
  border-color: #fecaca;
`;

const DangerTitle = styled(SectionTitle)`
  color: #991b1b;
`;

const DangerButton = styled.button`
  padding: 10px 20px;
  background: #ffffff;
  color: #dc2626;
  border: 1px solid #dc2626;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: #dc2626;
    color: #ffffff;
  }
`;

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notifications, setNotifications] = useState({
    deployments: true,
    marketing: false,
    security: true,
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/dashboard/settings');
    }
    if (session?.user) {
      setName(session.user.name || '');
      setEmail(session.user.email || '');
    }
  }, [status, router, session]);

  if (status === 'loading' || !session) {
    return null;
  }

  return (
    <DashboardLayout>
      <PageHeader>
        <Title>Settings</Title>
        <Subtitle>Manage your account preferences</Subtitle>
      </PageHeader>

      <Section>
        <SectionHeader>
          <SectionTitle>Profile</SectionTitle>
          <SectionDesc>Your personal information</SectionDesc>
        </SectionHeader>
        <SectionContent>
          <FormGroup>
            <Label>Name</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              disabled
            />
          </FormGroup>
          <ButtonGroup>
            <SaveButton>Save Changes</SaveButton>
            <CancelButton onClick={() => setName(session.user?.name || '')}>
              Cancel
            </CancelButton>
          </ButtonGroup>
        </SectionContent>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>Notifications</SectionTitle>
          <SectionDesc>Choose what updates you receive</SectionDesc>
        </SectionHeader>
        <SectionContent>
          <ToggleRow>
            <ToggleInfo>
              <ToggleLabel>Deployment notifications</ToggleLabel>
              <ToggleDesc>Get notified when deployments complete or fail</ToggleDesc>
            </ToggleInfo>
            <Toggle
              $active={notifications.deployments}
              onClick={() => setNotifications({ ...notifications, deployments: !notifications.deployments })}
            />
          </ToggleRow>
          <ToggleRow>
            <ToggleInfo>
              <ToggleLabel>Marketing emails</ToggleLabel>
              <ToggleDesc>Receive tips, product updates and offers</ToggleDesc>
            </ToggleInfo>
            <Toggle
              $active={notifications.marketing}
              onClick={() => setNotifications({ ...notifications, marketing: !notifications.marketing })}
            />
          </ToggleRow>
          <ToggleRow>
            <ToggleInfo>
              <ToggleLabel>Security alerts</ToggleLabel>
              <ToggleDesc>Important notifications about your account security</ToggleDesc>
            </ToggleInfo>
            <Toggle
              $active={notifications.security}
              onClick={() => setNotifications({ ...notifications, security: !notifications.security })}
            />
          </ToggleRow>
        </SectionContent>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>Password</SectionTitle>
          <SectionDesc>Update your password</SectionDesc>
        </SectionHeader>
        <SectionContent>
          <FormGroup>
            <Label>Current Password</Label>
            <Input type="password" placeholder="••••••••" />
          </FormGroup>
          <FormGroup>
            <Label>New Password</Label>
            <Input type="password" placeholder="••••••••" />
          </FormGroup>
          <FormGroup>
            <Label>Confirm New Password</Label>
            <Input type="password" placeholder="••••••••" />
          </FormGroup>
          <ButtonGroup>
            <SaveButton>Update Password</SaveButton>
          </ButtonGroup>
        </SectionContent>
      </Section>

      <DangerZone>
        <DangerHeader>
          <DangerTitle>Danger Zone</DangerTitle>
          <SectionDesc>Irreversible actions</SectionDesc>
        </DangerHeader>
        <SectionContent>
          <ToggleRow>
            <ToggleInfo>
              <ToggleLabel>Delete Account</ToggleLabel>
              <ToggleDesc>Permanently delete your account and all data</ToggleDesc>
            </ToggleInfo>
            <DangerButton>Delete Account</DangerButton>
          </ToggleRow>
        </SectionContent>
      </DangerZone>
    </DashboardLayout>
  );
}
