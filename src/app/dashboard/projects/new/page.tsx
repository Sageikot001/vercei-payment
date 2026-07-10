'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Icons } from '@/components/icons';

const PageHeader = styled.div`
  margin-bottom: 32px;
`;

const BackLink = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666666;
  background: none;
  border: none;
  padding: 0;
  margin-bottom: 16px;
  cursor: pointer;

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

const StepsContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 32px;
`;

const Step = styled.div<{ $active: boolean; $completed: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: ${({ $active, $completed }) =>
    $active ? '#000000' : $completed ? '#f5f5f5' : '#ffffff'};
  color: ${({ $active }) => ($active ? '#ffffff' : '#666666')};
  border: 1px solid ${({ $active }) => ($active ? '#000000' : '#eaeaea')};
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
`;

const StepNumber = styled.span<{ $completed: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${({ $completed }) => ($completed ? '#000000' : 'transparent')};
  color: ${({ $completed }) => ($completed ? '#ffffff' : 'inherit')};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid #eaeaea;
`;

const CardTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #000000;
  margin: 0 0 8px 0;
`;

const CardDesc = styled.p`
  font-size: 14px;
  color: #666666;
  margin: 0;
`;

const CardContent = styled.div`
  padding: 24px;
`;

const ImportOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ImportOption = styled.button<{ $selected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px;
  background: ${({ $selected }) => ($selected ? '#f5f5f5' : '#ffffff')};
  border: 2px solid ${({ $selected }) => ($selected ? '#000000' : '#eaeaea')};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #000000;
  }
`;

const ImportIcon = styled.div`
  width: 48px;
  height: 48px;
  background: #f5f5f5;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666666;
`;

const ImportLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #000000;
`;

const ImportDesc = styled.span`
  font-size: 12px;
  color: #666666;
  text-align: center;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 24px 0;
  color: #999999;
  font-size: 13px;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #eaeaea;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
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

const RepoList = styled.div`
  border: 1px solid #eaeaea;
  border-radius: 8px;
  max-height: 300px;
  overflow-y: auto;
`;

const RepoItem = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 16px;
  background: ${({ $selected }) => ($selected ? '#f5f5f5' : '#ffffff')};
  border: none;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f5f5f5;
  }
`;

const RepoIcon = styled.div`
  color: #666666;
`;

const RepoInfo = styled.div`
  flex: 1;
`;

const RepoName = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: #000000;
  margin: 0 0 2px 0;
`;

const RepoMeta = styled.p`
  font-size: 12px;
  color: #666666;
  margin: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #eaeaea;
`;

const SecondaryButton = styled.button`
  padding: 12px 24px;
  background: #ffffff;
  color: #333333;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    border-color: #000000;
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

  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
`;

const mockRepos = [
  { name: 'my-portfolio', language: 'TypeScript', updated: '2 days ago' },
  { name: 'e-commerce-app', language: 'JavaScript', updated: '1 week ago' },
  { name: 'blog-platform', language: 'TypeScript', updated: '3 days ago' },
  { name: 'landing-page', language: 'HTML', updated: '1 month ago' },
  { name: 'api-server', language: 'Python', updated: '5 days ago' },
];

export default function NewProjectPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [importType, setImportType] = useState<'git' | 'template' | 'upload' | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [projectName, setProjectName] = useState('');
  const [framework, setFramework] = useState('nextjs');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/dashboard/projects/new');
    }
  }, [status, router]);

  if (status === 'loading' || !session) {
    return null;
  }

  const handleContinue = () => {
    if (step === 1 && importType) {
      setStep(2);
    } else if (step === 2 && (selectedRepo || projectName)) {
      setStep(3);
    } else if (step === 3) {
      // Create project and redirect
      router.push('/dashboard/projects/demo-project?new=true');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.push('/dashboard/projects');
    }
  };

  return (
    <DashboardLayout>
      <PageHeader>
        <BackLink onClick={handleBack}>
          ← Back
        </BackLink>
        <Title>Create New Project</Title>
        <Subtitle>Deploy your website or application to VerceI</Subtitle>
      </PageHeader>

      <StepsContainer>
        <Step $active={step === 1} $completed={step > 1}>
          <StepNumber $completed={step > 1}>{step > 1 ? '✓' : '1'}</StepNumber>
          Import
        </Step>
        <Step $active={step === 2} $completed={step > 2}>
          <StepNumber $completed={step > 2}>{step > 2 ? '✓' : '2'}</StepNumber>
          Configure
        </Step>
        <Step $active={step === 3} $completed={false}>
          <StepNumber $completed={false}>3</StepNumber>
          Deploy
        </Step>
      </StepsContainer>

      <Card>
        {step === 1 && (
          <>
            <CardHeader>
              <CardTitle>Import your project</CardTitle>
              <CardDesc>Choose how you want to import your project</CardDesc>
            </CardHeader>
            <CardContent>
              <ImportOptions>
                <ImportOption
                  $selected={importType === 'git'}
                  onClick={() => setImportType('git')}
                >
                  <ImportIcon>{Icons.code}</ImportIcon>
                  <ImportLabel>Import Git Repository</ImportLabel>
                  <ImportDesc>Connect to GitHub, GitLab, or Bitbucket</ImportDesc>
                </ImportOption>
                <ImportOption
                  $selected={importType === 'template'}
                  onClick={() => setImportType('template')}
                >
                  <ImportIcon>{Icons.projects}</ImportIcon>
                  <ImportLabel>Start from Template</ImportLabel>
                  <ImportDesc>Choose from pre-built templates</ImportDesc>
                </ImportOption>
                <ImportOption
                  $selected={importType === 'upload'}
                  onClick={() => setImportType('upload')}
                >
                  <ImportIcon>{Icons.plus}</ImportIcon>
                  <ImportLabel>Upload Files</ImportLabel>
                  <ImportDesc>Drag and drop your project files</ImportDesc>
                </ImportOption>
              </ImportOptions>

              <ButtonGroup>
                <SecondaryButton onClick={handleBack}>Cancel</SecondaryButton>
                <PrimaryButton onClick={handleContinue} disabled={!importType}>
                  Continue
                </PrimaryButton>
              </ButtonGroup>
            </CardContent>
          </>
        )}

        {step === 2 && importType === 'git' && (
          <>
            <CardHeader>
              <CardTitle>Select Repository</CardTitle>
              <CardDesc>Choose the repository you want to deploy</CardDesc>
            </CardHeader>
            <CardContent>
              <FormGroup>
                <Label>Search repositories</Label>
                <Input placeholder="Search your repositories..." />
              </FormGroup>

              <RepoList>
                {mockRepos.map((repo) => (
                  <RepoItem
                    key={repo.name}
                    $selected={selectedRepo === repo.name}
                    onClick={() => {
                      setSelectedRepo(repo.name);
                      setProjectName(repo.name);
                    }}
                  >
                    <RepoIcon>{Icons.projects}</RepoIcon>
                    <RepoInfo>
                      <RepoName>{repo.name}</RepoName>
                      <RepoMeta>{repo.language} • Updated {repo.updated}</RepoMeta>
                    </RepoInfo>
                    {selectedRepo === repo.name && (
                      <span style={{ color: '#000000' }}>{Icons.check}</span>
                    )}
                  </RepoItem>
                ))}
              </RepoList>

              <ButtonGroup>
                <SecondaryButton onClick={handleBack}>Back</SecondaryButton>
                <PrimaryButton onClick={handleContinue} disabled={!selectedRepo}>
                  Continue
                </PrimaryButton>
              </ButtonGroup>
            </CardContent>
          </>
        )}

        {step === 2 && importType === 'template' && (
          <>
            <CardHeader>
              <CardTitle>Choose a Template</CardTitle>
              <CardDesc>Start with a pre-configured project</CardDesc>
            </CardHeader>
            <CardContent>
              <ImportOptions>
                <ImportOption $selected={false} onClick={() => setProjectName('nextjs-starter')}>
                  <ImportIcon>{Icons.code}</ImportIcon>
                  <ImportLabel>Next.js</ImportLabel>
                  <ImportDesc>React framework with SSR</ImportDesc>
                </ImportOption>
                <ImportOption $selected={false} onClick={() => setProjectName('react-starter')}>
                  <ImportIcon>{Icons.code}</ImportIcon>
                  <ImportLabel>React</ImportLabel>
                  <ImportDesc>Single-page application</ImportDesc>
                </ImportOption>
                <ImportOption $selected={false} onClick={() => setProjectName('static-site')}>
                  <ImportIcon>{Icons.globe}</ImportIcon>
                  <ImportLabel>Static Site</ImportLabel>
                  <ImportDesc>HTML, CSS, JavaScript</ImportDesc>
                </ImportOption>
              </ImportOptions>

              <FormGroup>
                <Label>Project Name</Label>
                <Input
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="my-awesome-project"
                />
              </FormGroup>

              <ButtonGroup>
                <SecondaryButton onClick={handleBack}>Back</SecondaryButton>
                <PrimaryButton onClick={handleContinue} disabled={!projectName}>
                  Continue
                </PrimaryButton>
              </ButtonGroup>
            </CardContent>
          </>
        )}

        {step === 2 && importType === 'upload' && (
          <>
            <CardHeader>
              <CardTitle>Upload Your Project</CardTitle>
              <CardDesc>Drag and drop your project files or folder</CardDesc>
            </CardHeader>
            <CardContent>
              <div style={{
                border: '2px dashed #eaeaea',
                borderRadius: '12px',
                padding: '48px',
                textAlign: 'center',
                marginBottom: '24px'
              }}>
                <div style={{ color: '#cccccc', marginBottom: '16px' }}>
                  {Icons.plus}
                </div>
                <p style={{ margin: '0 0 8px 0', fontWeight: '500' }}>
                  Drop your files here
                </p>
                <p style={{ margin: 0, fontSize: '13px', color: '#666666' }}>
                  or click to browse
                </p>
              </div>

              <FormGroup>
                <Label>Project Name</Label>
                <Input
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="my-awesome-project"
                />
              </FormGroup>

              <ButtonGroup>
                <SecondaryButton onClick={handleBack}>Back</SecondaryButton>
                <PrimaryButton onClick={handleContinue} disabled={!projectName}>
                  Continue
                </PrimaryButton>
              </ButtonGroup>
            </CardContent>
          </>
        )}

        {step === 3 && (
          <>
            <CardHeader>
              <CardTitle>Configure Your Project</CardTitle>
              <CardDesc>Set up build settings and environment variables</CardDesc>
            </CardHeader>
            <CardContent>
              <FormGroup>
                <Label>Project Name</Label>
                <Input
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </FormGroup>

              <FormGroup>
                <Label>Framework Preset</Label>
                <Select value={framework} onChange={(e) => setFramework(e.target.value)}>
                  <option value="nextjs">Next.js</option>
                  <option value="react">Create React App</option>
                  <option value="vue">Vue.js</option>
                  <option value="nuxt">Nuxt</option>
                  <option value="svelte">SvelteKit</option>
                  <option value="astro">Astro</option>
                  <option value="static">Static (HTML/CSS/JS)</option>
                </Select>
              </FormGroup>

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

              <Divider>Environment Variables (Optional)</Divider>

              <FormGroup>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Input placeholder="KEY" style={{ flex: 1 }} />
                  <Input placeholder="value" style={{ flex: 2 }} />
                  <SecondaryButton style={{ padding: '12px' }}>{Icons.plus}</SecondaryButton>
                </div>
              </FormGroup>

              <ButtonGroup>
                <SecondaryButton onClick={handleBack}>Back</SecondaryButton>
                <PrimaryButton onClick={handleContinue}>
                  Deploy
                </PrimaryButton>
              </ButtonGroup>
            </CardContent>
          </>
        )}
      </Card>
    </DashboardLayout>
  );
}
