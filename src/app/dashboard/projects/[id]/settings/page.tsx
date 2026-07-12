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

const TabsContainer = styled.div`
  display: flex;
  gap: 4px;
  border-bottom: 1px solid #eaeaea;
  margin-bottom: 32px;
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

const Section = styled.div`
  margin-bottom: 32px;
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #f5f5f5;
`;

const CardTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: #000000;
  margin: 0 0 4px 0;
`;

const CardDesc = styled.p`
  font-size: 13px;
  color: #666666;
  margin: 0;
`;

const CardContent = styled.div`
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
  padding: 12px 16px;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #000000;
  }

  &::placeholder {
    color: #999999;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  font-size: 14px;
  background: #ffffff;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #000000;
  }
`;

const EnvTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const EnvRow = styled.tr`
  border-bottom: 1px solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }
`;

const EnvCell = styled.td`
  padding: 12px 0;
  vertical-align: middle;
`;

const EnvKey = styled.code`
  font-family: monospace;
  font-size: 13px;
  color: #000000;
  background: #f5f5f5;
  padding: 4px 8px;
  border-radius: 4px;
`;

const EnvValue = styled.span`
  font-size: 13px;
  color: #666666;
`;

const EnvActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

const IconButton = styled.button`
  padding: 8px;
  background: none;
  border: none;
  color: #666666;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background: #f5f5f5;
    color: #000000;
  }
`;

const AddEnvRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f5f5f5;
`;

const SmallInput = styled(Input)`
  flex: 1;
`;

const AddButton = styled.button`
  padding: 12px 20px;
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

const DomainList = styled.div``;

const DomainItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }
`;

const DomainInfo = styled.div``;

const DomainName = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: #000000;
  margin: 0 0 4px 0;
`;

const DomainStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
`;

const StatusBadge = styled.span<{ $status: string }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  background: ${({ $status }) =>
    $status === 'valid' ? '#dcfce7' :
    $status === 'pending' ? '#fef3c7' :
    '#fee2e2'
  };
  color: ${({ $status }) =>
    $status === 'valid' ? '#166534' :
    $status === 'pending' ? '#92400e' :
    '#991b1b'
  };
`;

const SSLBadge = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #059669;
`;

const DomainActions = styled.div`
  display: flex;
  gap: 8px;
`;

const SecondaryButton = styled.button`
  padding: 8px 16px;
  background: #f5f5f5;
  color: #333333;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;

  &:hover {
    background: #eaeaea;
  }
`;

const PrimaryButton = styled.button`
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

const AddDomainSection = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #f5f5f5;
`;

const DangerZone = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  overflow: hidden;
`;

const DangerHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #fecaca;
`;

const DangerTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: #991b1b;
  margin: 0 0 4px 0;
`;

const DangerDesc = styled.p`
  font-size: 13px;
  color: #b91c1c;
  margin: 0;
`;

const DangerContent = styled.div`
  padding: 24px;
`;

const DangerItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid #fecaca;

  &:last-child {
    border-bottom: none;
  }
`;

const DangerItemInfo = styled.div``;

const DangerItemTitle = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: #000000;
  margin: 0 0 4px 0;
`;

const DangerItemDesc = styled.p`
  font-size: 13px;
  color: #666666;
  margin: 0;
`;

const DangerButton = styled.button`
  padding: 8px 16px;
  background: #ffffff;
  color: #dc2626;
  border: 1px solid #dc2626;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: #dc2626;
    color: #ffffff;
  }
`;

const mockEnvVars = [
  { key: 'DATABASE_URL', value: '••••••••••••', encrypted: true },
  { key: 'API_KEY', value: '••••••••••••', encrypted: true },
  { key: 'NODE_ENV', value: 'production', encrypted: false },
];

const mockDomains = [
  { domain: 'my-project.vercei.app', status: 'valid', ssl: true, primary: true },
  { domain: 'myproject.com', status: 'valid', ssl: true, primary: false },
  { domain: 'staging.myproject.com', status: 'pending', ssl: false, primary: false },
];

export default function ProjectSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [activeTab, setActiveTab] = useState('general');
  const [newEnvKey, setNewEnvKey] = useState('');
  const [newEnvValue, setNewEnvValue] = useState('');
  const [newDomain, setNewDomain] = useState('');

  const projectId = params.id as string;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/login?callbackUrl=/dashboard/projects/${projectId}/settings`);
    }
  }, [status, router, projectId]);

  if (status === 'loading' || !session) {
    return null;
  }

  return (
    <DashboardLayout>
      <PageHeader>
        <BackLink href={`/dashboard/projects/${projectId}`}>← Back to Project</BackLink>
        <Title>Project Settings</Title>
        <Subtitle>Manage settings for {projectId}</Subtitle>
      </PageHeader>

      <TabsContainer>
        <Tab $active={activeTab === 'general'} onClick={() => setActiveTab('general')}>
          General
        </Tab>
        <Tab $active={activeTab === 'domains'} onClick={() => setActiveTab('domains')}>
          Domains
        </Tab>
        <Tab $active={activeTab === 'environment'} onClick={() => setActiveTab('environment')}>
          Environment Variables
        </Tab>
        <Tab $active={activeTab === 'build'} onClick={() => setActiveTab('build')}>
          Build & Deploy
        </Tab>
        <Tab $active={activeTab === 'advanced'} onClick={() => setActiveTab('advanced')}>
          Advanced
        </Tab>
      </TabsContainer>

      {activeTab === 'general' && (
        <>
          <Section>
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
                <CardDesc>Basic information about your project</CardDesc>
              </CardHeader>
              <CardContent>
                <FormGroup>
                  <Label>Project Name</Label>
                  <Input defaultValue={projectId} />
                </FormGroup>
                <FormGroup>
                  <Label>Framework</Label>
                  <Select defaultValue="nextjs">
                    <option value="nextjs">Next.js</option>
                    <option value="react">Create React App</option>
                    <option value="vue">Vue.js</option>
                    <option value="nuxt">Nuxt</option>
                    <option value="svelte">SvelteKit</option>
                    <option value="astro">Astro</option>
                  </Select>
                </FormGroup>
                <FormGroup>
                  <Label>Root Directory</Label>
                  <Input defaultValue="./" placeholder="./" />
                </FormGroup>
                <div style={{ marginTop: '24px' }}>
                  <PrimaryButton>Save Changes</PrimaryButton>
                </div>
              </CardContent>
            </Card>
          </Section>

          <Section>
            <Card>
              <CardHeader>
                <CardTitle>Git Repository</CardTitle>
                <CardDesc>Connected repository settings</CardDesc>
              </CardHeader>
              <CardContent>
                <FormGroup>
                  <Label>Repository</Label>
                  <Input defaultValue={`user/${projectId}`} readOnly style={{ background: '#f5f5f5' }} />
                </FormGroup>
                <FormGroup>
                  <Label>Production Branch</Label>
                  <Input defaultValue="main" />
                </FormGroup>
                <div style={{ marginTop: '24px' }}>
                  <PrimaryButton>Save Changes</PrimaryButton>
                </div>
              </CardContent>
            </Card>
          </Section>
        </>
      )}

      {activeTab === 'domains' && (
        <Section>
          <Card>
            <CardHeader>
              <CardTitle>Domains</CardTitle>
              <CardDesc>Custom domains connected to your project</CardDesc>
            </CardHeader>
            <CardContent>
              <DomainList>
                {mockDomains.map((domain, idx) => (
                  <DomainItem key={idx}>
                    <DomainInfo>
                      <DomainName>
                        {domain.domain}
                        {domain.primary && (
                          <span style={{ marginLeft: '8px', fontSize: '11px', color: '#666666' }}>
                            (Primary)
                          </span>
                        )}
                      </DomainName>
                      <DomainStatus>
                        <StatusBadge $status={domain.status}>
                          {domain.status === 'valid' ? 'Valid Configuration' : 'Pending DNS'}
                        </StatusBadge>
                        {domain.ssl && (
                          <SSLBadge>{Icons.lock} SSL</SSLBadge>
                        )}
                      </DomainStatus>
                    </DomainInfo>
                    <DomainActions>
                      {!domain.primary && (
                        <SecondaryButton>Set Primary</SecondaryButton>
                      )}
                      <SecondaryButton>Configure</SecondaryButton>
                    </DomainActions>
                  </DomainItem>
                ))}
              </DomainList>

              <AddDomainSection>
                <Label>Add Domain</Label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <SmallInput
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    placeholder="example.com"
                  />
                  <AddButton>Add</AddButton>
                </div>
              </AddDomainSection>
            </CardContent>
          </Card>
        </Section>
      )}

      {activeTab === 'environment' && (
        <Section>
          <Card>
            <CardHeader>
              <CardTitle>Environment Variables</CardTitle>
              <CardDesc>Configure environment variables for your deployments</CardDesc>
            </CardHeader>
            <CardContent>
              <EnvTable>
                <tbody>
                  {mockEnvVars.map((envVar, idx) => (
                    <EnvRow key={idx}>
                      <EnvCell><EnvKey>{envVar.key}</EnvKey></EnvCell>
                      <EnvCell><EnvValue>{envVar.value}</EnvValue></EnvCell>
                      <EnvCell>
                        <EnvActions>
                          <IconButton title="Edit">{Icons.settings}</IconButton>
                          <IconButton title="Delete" style={{ color: '#dc2626' }}>
                            {Icons.plus}
                          </IconButton>
                        </EnvActions>
                      </EnvCell>
                    </EnvRow>
                  ))}
                </tbody>
              </EnvTable>

              <AddEnvRow>
                <SmallInput
                  value={newEnvKey}
                  onChange={(e) => setNewEnvKey(e.target.value)}
                  placeholder="KEY"
                />
                <SmallInput
                  value={newEnvValue}
                  onChange={(e) => setNewEnvValue(e.target.value)}
                  placeholder="value"
                />
                <AddButton>Add</AddButton>
              </AddEnvRow>
            </CardContent>
          </Card>
        </Section>
      )}

      {activeTab === 'build' && (
        <Section>
          <Card>
            <CardHeader>
              <CardTitle>Build & Output Settings</CardTitle>
              <CardDesc>Configure how your project is built and deployed</CardDesc>
            </CardHeader>
            <CardContent>
              <FormGroup>
                <Label>Build Command</Label>
                <Input defaultValue="npm run build" placeholder="npm run build" />
              </FormGroup>
              <FormGroup>
                <Label>Output Directory</Label>
                <Input defaultValue=".next" placeholder=".next" />
              </FormGroup>
              <FormGroup>
                <Label>Install Command</Label>
                <Input defaultValue="npm install" placeholder="npm install" />
              </FormGroup>
              <FormGroup>
                <Label>Node.js Version</Label>
                <Select defaultValue="18.x">
                  <option value="20.x">20.x (Latest)</option>
                  <option value="18.x">18.x (LTS)</option>
                  <option value="16.x">16.x</option>
                </Select>
              </FormGroup>
              <div style={{ marginTop: '24px' }}>
                <PrimaryButton>Save Changes</PrimaryButton>
              </div>
            </CardContent>
          </Card>
        </Section>
      )}

      {activeTab === 'advanced' && (
        <Section>
          <DangerZone>
            <DangerHeader>
              <DangerTitle>Danger Zone</DangerTitle>
              <DangerDesc>Irreversible and destructive actions</DangerDesc>
            </DangerHeader>
            <DangerContent>
              <DangerItem>
                <DangerItemInfo>
                  <DangerItemTitle>Transfer Project</DangerItemTitle>
                  <DangerItemDesc>Transfer this project to another team or account</DangerItemDesc>
                </DangerItemInfo>
                <DangerButton>Transfer</DangerButton>
              </DangerItem>
              <DangerItem>
                <DangerItemInfo>
                  <DangerItemTitle>Delete Project</DangerItemTitle>
                  <DangerItemDesc>Permanently delete this project and all its deployments</DangerItemDesc>
                </DangerItemInfo>
                <DangerButton>Delete Project</DangerButton>
              </DangerItem>
            </DangerContent>
          </DangerZone>
        </Section>
      )}
    </DashboardLayout>
  );
}
