'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { Icons } from '@/components/icons';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

interface Domain {
  id: string;
  domain: string;
  project_id: string | null;
  projects?: { id: string; name: string } | null;
  is_primary: boolean;
  verified: boolean;
  ssl_status: 'pending' | 'active' | 'error';
  verification_token?: string;
  created_at: string;
}

interface Project {
  id: string;
  name: string;
}

interface DNSRecord {
  id: string;
  type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'NS';
  name: string;
  value: string;
  ttl: number;
  priority?: number;
}

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #000000;
  margin: 0;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
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

  svg {
    width: 16px;
    height: 16px;
  }
`;

const DomainsTable = styled.div`
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 100px 100px 120px;
  padding: 16px 24px;
  background: #fafafa;
  border-bottom: 1px solid #eaeaea;
  font-size: 12px;
  font-weight: 600;
  color: #666666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 100px 100px 120px;
  padding: 16px 24px;
  border-bottom: 1px solid #f5f5f5;
  align-items: center;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #fafafa;
  }
`;

const DomainCell = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const DomainIcon = styled.div`
  width: 36px;
  height: 36px;
  background: #f5f5f5;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666666;

  svg {
    width: 18px;
    height: 18px;
  }
`;

const DomainInfo = styled.div``;

const DomainName = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: #000000;
  margin: 0 0 2px 0;
`;

const DomainMeta = styled.p`
  font-size: 12px;
  color: #666666;
  margin: 0;
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  background: ${({ $status }) =>
    $status === 'active' || $status === 'verified' ? '#dcfce7' :
    $status === 'pending' ? '#fef3c7' :
    '#fee2e2'
  };
  color: ${({ $status }) =>
    $status === 'active' || $status === 'verified' ? '#166534' :
    $status === 'pending' ? '#92400e' :
    '#991b1b'
  };
`;

const SSLBadge = styled.span<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: ${({ $active }) => $active ? '#059669' : '#9ca3af'};

  svg {
    width: 14px;
    height: 14px;
  }
`;

const ActionButton = styled.button`
  padding: 6px 14px;
  background: #f5f5f5;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  color: #333333;
  cursor: pointer;

  &:hover {
    background: #eaeaea;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 24px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
`;

const EmptyIcon = styled.div`
  color: #cccccc;
  display: flex;
  justify-content: center;
  margin-bottom: 24px;

  svg {
    width: 64px;
    height: 64px;
  }
`;

const EmptyTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #000000;
  margin: 0 0 8px 0;
`;

const EmptyText = styled.p`
  font-size: 14px;
  color: #666666;
  margin: 0 0 24px 0;
`;

// Modal Styles
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: #ffffff;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid #eaeaea;
`;

const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #000000;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #666666;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;

  &:hover {
    background: #f5f5f5;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const ModalBody = styled.div`
  padding: 24px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #333333;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #e0e0e0;
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
  padding: 12px 14px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  background: #ffffff;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #000000;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #eaeaea;
`;

const CancelButton = styled.button`
  padding: 10px 20px;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: #f5f5f5;
  }
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
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

// DNS Records Table
const DNSSection = styled.div`
  margin-top: 24px;
`;

const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #000000;
  margin: 0 0 16px 0;
`;

const DNSTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
`;

const DNSTableHeader = styled.thead`
  background: #fafafa;

  th {
    padding: 10px 12px;
    text-align: left;
    font-weight: 600;
    color: #666666;
    border-bottom: 1px solid #eaeaea;
  }
`;

const DNSTableBody = styled.tbody`
  tr {
    border-bottom: 1px solid #f5f5f5;

    &:last-child {
      border-bottom: none;
    }
  }

  td {
    padding: 12px;
    color: #333333;
  }
`;

const DNSTypeCell = styled.td`
  width: 80px;
`;

const DNSTypeBadge = styled.span<{ $type: string }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  background: ${({ $type }) =>
    $type === 'A' ? '#dbeafe' :
    $type === 'AAAA' ? '#e0e7ff' :
    $type === 'CNAME' ? '#fce7f3' :
    $type === 'MX' ? '#dcfce7' :
    $type === 'TXT' ? '#fef3c7' :
    '#f3f4f6'
  };
  color: ${({ $type }) =>
    $type === 'A' ? '#1e40af' :
    $type === 'AAAA' ? '#3730a3' :
    $type === 'CNAME' ? '#9d174d' :
    $type === 'MX' ? '#166534' :
    $type === 'TXT' ? '#92400e' :
    '#374151'
  };
`;

const CodeValue = styled.code`
  font-family: 'SF Mono', Monaco, monospace;
  font-size: 12px;
  background: #f5f5f5;
  padding: 4px 8px;
  border-radius: 4px;
  word-break: break-all;
`;

const AddRecordButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: #f5f5f5;
  border: 1px dashed #d0d0d0;
  border-radius: 6px;
  font-size: 13px;
  color: #666666;
  cursor: pointer;
  margin-top: 12px;

  &:hover {
    background: #eaeaea;
    border-color: #c0c0c0;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const SSLSection = styled.div`
  margin-top: 24px;
  padding: 20px;
  background: #fafafa;
  border-radius: 10px;
`;

const SSLHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const SSLTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: #000000;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    width: 16px;
    height: 16px;
  }
`;

const SSLStatus = styled.span<{ $active: boolean }>`
  font-size: 12px;
  color: ${({ $active }) => $active ? '#059669' : '#f59e0b'};
  font-weight: 500;
`;

const SSLInfo = styled.p`
  font-size: 13px;
  color: #666666;
  margin: 0;
`;

const Checkbox = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #333333;
  cursor: pointer;

  input {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
`;

const VerificationBox = styled.div`
  margin-top: 20px;
  padding: 16px;
  background: #fffbeb;
  border: 1px solid #fcd34d;
  border-radius: 8px;
`;

const VerificationTitle = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: #92400e;
  margin: 0 0 8px 0;
`;

const VerificationText = styled.p`
  font-size: 12px;
  color: #78350f;
  margin: 0 0 12px 0;
`;

const VerificationRecord = styled.div`
  background: #ffffff;
  border-radius: 6px;
  padding: 12px;
  font-family: 'SF Mono', Monaco, monospace;
  font-size: 12px;

  p {
    margin: 0 0 4px 0;
    color: #666666;

    strong {
      color: #000000;
    }
  }
`;

const DeleteButton = styled.button`
  padding: 6px 12px;
  background: #fee2e2;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  color: #991b1b;
  cursor: pointer;

  &:hover {
    background: #fecaca;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
  color: #666666;
`;

export default function DomainsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [saving, setSaving] = useState(false);
  const [canAddDomains, setCanAddDomains] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  // Add domain form
  const [newDomain, setNewDomain] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);

  // DNS Records for config modal
  const [dnsRecords, setDnsRecords] = useState<DNSRecord[]>([]);
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [newRecord, setNewRecord] = useState<Partial<DNSRecord>>({
    type: 'A',
    name: '@',
    value: '',
    ttl: 3600,
  });

  const fetchDomains = useCallback(async () => {
    try {
      const [domainsRes, projectsRes] = await Promise.all([
        fetch('/api/domains'),
        fetch('/api/projects'),
      ]);

      const domainsData = await domainsRes.json();
      const projectsData = await projectsRes.json();

      setDomains(domainsData.domains || []);
      setProjects(projectsData.projects || []);
      setCanAddDomains(domainsData.canAddDomains || false);
    } catch (error) {
      console.error('Error fetching domains:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/dashboard/domains');
    }
    if (status === 'authenticated') {
      fetchDomains();
    }
  }, [status, router, fetchDomains]);

  const handleAddDomain = async () => {
    if (!newDomain) return;
    setSaving(true);
    setAddError(null);

    try {
      const res = await fetch('/api/domains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: newDomain,
          projectId: selectedProject || null,
          isPrimary: selectedProject ? isPrimary : false,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setShowAddModal(false);
        setNewDomain('');
        setSelectedProject('');
        setIsPrimary(false);
        fetchDomains();
      } else {
        setAddError(data.error || 'Failed to add domain');
      }
    } catch (error) {
      console.error('Error adding domain:', error);
      setAddError('An error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleVerifyDomain = async (domain: Domain) => {
    try {
      const res = await fetch(`/api/domains/${domain.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verify: true }),
      });

      if (res.ok) {
        fetchDomains();
        if (selectedDomain?.id === domain.id) {
          const data = await res.json();
          setSelectedDomain(data.domain);
        }
      }
    } catch (error) {
      console.error('Error verifying domain:', error);
    }
  };

  const handleDeleteDomain = async (domain: Domain) => {
    if (!confirm(`Are you sure you want to delete ${domain.domain}?`)) return;

    try {
      const res = await fetch(`/api/domains/${domain.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setShowConfigModal(false);
        setSelectedDomain(null);
        fetchDomains();
      }
    } catch (error) {
      console.error('Error deleting domain:', error);
    }
  };

  const handleConnectProject = async (domainId: string, projectId: string | null) => {
    try {
      const res = await fetch(`/api/domains/${domainId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectId ? { projectId } : { disconnect: true }),
      });

      if (res.ok) {
        const data = await res.json();
        setSelectedDomain(data.domain);
        fetchDomains();
      }
    } catch (error) {
      console.error('Error updating domain:', error);
    }
  };

  const handleAddRecord = () => {
    if (!newRecord.value) return;
    const record: DNSRecord = {
      id: `dns_${Date.now()}`,
      type: newRecord.type as DNSRecord['type'],
      name: newRecord.name || '@',
      value: newRecord.value,
      ttl: newRecord.ttl || 3600,
      priority: newRecord.priority,
    };
    setDnsRecords([...dnsRecords, record]);
    setShowAddRecord(false);
    setNewRecord({ type: 'A', name: '@', value: '', ttl: 3600 });
  };

  const handleRemoveRecord = (id: string) => {
    setDnsRecords(dnsRecords.filter(r => r.id !== id));
  };

  const openConfigModal = (domain: Domain) => {
    setSelectedDomain(domain);
    setDnsRecords([
      {
        id: 'dns_1',
        type: 'A',
        name: '@',
        value: '76.76.21.21',
        ttl: 3600,
      },
      {
        id: 'dns_2',
        type: 'CNAME',
        name: 'www',
        value: 'cname.vercei.app',
        ttl: 3600,
      },
    ]);
    setShowConfigModal(true);
  };

  if (status === 'loading' || !session) {
    return null;
  }

  return (
    <DashboardLayout>
      <PageHeader>
        <Title>Domains</Title>
        <AddButton
          onClick={() => canAddDomains ? setShowAddModal(true) : router.push('/pricing')}
          style={{ background: canAddDomains ? '#000000' : '#666666' }}
        >
          {Icons.plus}
          {canAddDomains ? 'Add Domain' : 'Upgrade to Add Domains'}
        </AddButton>
      </PageHeader>

      {!loading && !canAddDomains && (
        <div style={{
          padding: '16px 20px',
          background: '#fef3c7',
          border: '1px solid #fcd34d',
          borderRadius: '8px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <p style={{ margin: 0, color: '#92400e', fontSize: '14px' }}>
            An active subscription is required to add custom domains.
          </p>
          <ActionButton onClick={() => router.push('/pricing')} style={{ background: '#000', color: '#fff' }}>
            View Plans
          </ActionButton>
        </div>
      )}

      {loading ? (
        <LoadingSpinner>Loading domains...</LoadingSpinner>
      ) : domains.length === 0 ? (
        <EmptyState>
          <EmptyIcon>{Icons.globe}</EmptyIcon>
          <EmptyTitle>No domains configured</EmptyTitle>
          <EmptyText>
            {canAddDomains
              ? 'Connect a custom domain to your projects'
              : 'Subscribe to a plan to add custom domains'}
          </EmptyText>
          <AddButton
            onClick={() => canAddDomains ? setShowAddModal(true) : router.push('/pricing')}
            style={{ background: canAddDomains ? '#000000' : '#666666' }}
          >
            {Icons.plus}
            {canAddDomains ? 'Add Domain' : 'View Plans'}
          </AddButton>
        </EmptyState>
      ) : (
        <DomainsTable>
          <TableHeader>
            <span>Domain</span>
            <span>Project</span>
            <span>Status</span>
            <span>SSL</span>
            <span>Actions</span>
          </TableHeader>
          {domains.map((domain) => (
            <TableRow key={domain.id}>
              <DomainCell>
                <DomainIcon>{Icons.globe}</DomainIcon>
                <DomainInfo>
                  <DomainName>{domain.domain}</DomainName>
                  <DomainMeta>
                    {domain.is_primary ? 'Primary' : domain.project_id ? 'Secondary' : 'Unassigned'}
                  </DomainMeta>
                </DomainInfo>
              </DomainCell>
              <span style={{ color: domain.projects?.name ? '#000' : '#999' }}>
                {domain.projects?.name || 'Not connected'}
              </span>
              <StatusBadge $status={domain.verified ? 'verified' : 'pending'}>
                {domain.verified ? 'Verified' : 'Pending'}
              </StatusBadge>
              <SSLBadge $active={domain.ssl_status === 'active'}>
                {Icons.lock}
                {domain.ssl_status === 'active' ? 'Active' : 'Pending'}
              </SSLBadge>
              <ActionButton onClick={() => openConfigModal(domain)}>
                Configure
              </ActionButton>
            </TableRow>
          ))}
        </DomainsTable>
      )}

      {/* Add Domain Modal */}
      {showAddModal && (
        <ModalOverlay onClick={() => setShowAddModal(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Add Domain</ModalTitle>
              <CloseButton onClick={() => setShowAddModal(false)}>
                {Icons.close}
              </CloseButton>
            </ModalHeader>
            <ModalBody>
              {addError && (
                <div style={{
                  padding: '12px 16px',
                  background: '#fee2e2',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  color: '#991b1b',
                  fontSize: '14px',
                }}>
                  {addError}
                </div>
              )}
              <FormGroup>
                <Label>Domain Name</Label>
                <Input
                  type="text"
                  placeholder="example.com"
                  value={newDomain}
                  onChange={(e) => {
                    setNewDomain(e.target.value);
                    setAddError(null);
                  }}
                />
              </FormGroup>
              <FormGroup>
                <Label>Connect to Project (Optional)</Label>
                <Select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                >
                  <option value="">No project - connect later</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </Select>
              </FormGroup>
              {selectedProject && (
                <FormGroup>
                  <Checkbox>
                    <input
                      type="checkbox"
                      checked={isPrimary}
                      onChange={(e) => setIsPrimary(e.target.checked)}
                    />
                    Set as primary domain for this project
                  </Checkbox>
                </FormGroup>
              )}
            </ModalBody>
            <ModalFooter>
              <CancelButton onClick={() => setShowAddModal(false)}>
                Cancel
              </CancelButton>
              <SubmitButton
                onClick={handleAddDomain}
                disabled={!newDomain || saving}
              >
                {saving ? 'Adding...' : 'Add Domain'}
              </SubmitButton>
            </ModalFooter>
          </Modal>
        </ModalOverlay>
      )}

      {/* Configure Domain Modal */}
      {showConfigModal && selectedDomain && (
        <ModalOverlay onClick={() => setShowConfigModal(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Configure {selectedDomain.domain}</ModalTitle>
              <CloseButton onClick={() => setShowConfigModal(false)}>
                {Icons.close}
              </CloseButton>
            </ModalHeader>
            <ModalBody>
              {!selectedDomain.verified && (
                <VerificationBox>
                  <VerificationTitle>Domain Verification Required</VerificationTitle>
                  <VerificationText>
                    Add the following TXT record to your DNS settings to verify ownership:
                  </VerificationText>
                  <VerificationRecord>
                    <p><strong>Type:</strong> TXT</p>
                    <p><strong>Name:</strong> _vercei-verification</p>
                    <p><strong>Value:</strong> {selectedDomain.verification_token || 'Loading...'}</p>
                  </VerificationRecord>
                  <SubmitButton
                    onClick={() => handleVerifyDomain(selectedDomain)}
                    style={{ marginTop: '12px', width: '100%' }}
                  >
                    Verify Domain
                  </SubmitButton>
                </VerificationBox>
              )}

              <DNSSection>
                <SectionTitle>DNS Records</SectionTitle>
                <DNSTable>
                  <DNSTableHeader>
                    <tr>
                      <th>Type</th>
                      <th>Name</th>
                      <th>Value</th>
                      <th>TTL</th>
                      <th></th>
                    </tr>
                  </DNSTableHeader>
                  <DNSTableBody>
                    {dnsRecords.map((record) => (
                      <tr key={record.id}>
                        <DNSTypeCell>
                          <DNSTypeBadge $type={record.type}>{record.type}</DNSTypeBadge>
                        </DNSTypeCell>
                        <td>{record.name}</td>
                        <td><CodeValue>{record.value}</CodeValue></td>
                        <td>{record.ttl}s</td>
                        <td>
                          <DeleteButton onClick={() => handleRemoveRecord(record.id)}>
                            Remove
                          </DeleteButton>
                        </td>
                      </tr>
                    ))}
                  </DNSTableBody>
                </DNSTable>

                {showAddRecord ? (
                  <div style={{ marginTop: '16px', padding: '16px', background: '#f9f9f9', borderRadius: '8px' }}>
                    <FormRow>
                      <FormGroup>
                        <Label>Type</Label>
                        <Select
                          value={newRecord.type}
                          onChange={(e) => setNewRecord({ ...newRecord, type: e.target.value as DNSRecord['type'] })}
                        >
                          <option value="A">A</option>
                          <option value="AAAA">AAAA</option>
                          <option value="CNAME">CNAME</option>
                          <option value="MX">MX</option>
                          <option value="TXT">TXT</option>
                          <option value="NS">NS</option>
                        </Select>
                      </FormGroup>
                      <FormGroup>
                        <Label>Name</Label>
                        <Input
                          type="text"
                          placeholder="@"
                          value={newRecord.name}
                          onChange={(e) => setNewRecord({ ...newRecord, name: e.target.value })}
                        />
                      </FormGroup>
                    </FormRow>
                    <FormGroup>
                      <Label>Value</Label>
                      <Input
                        type="text"
                        placeholder={newRecord.type === 'A' ? '192.168.1.1' : 'value'}
                        value={newRecord.value}
                        onChange={(e) => setNewRecord({ ...newRecord, value: e.target.value })}
                      />
                    </FormGroup>
                    <FormRow>
                      <FormGroup>
                        <Label>TTL (seconds)</Label>
                        <Select
                          value={newRecord.ttl}
                          onChange={(e) => setNewRecord({ ...newRecord, ttl: parseInt(e.target.value) })}
                        >
                          <option value={300}>300 (5 min)</option>
                          <option value={3600}>3600 (1 hour)</option>
                          <option value={14400}>14400 (4 hours)</option>
                          <option value={86400}>86400 (1 day)</option>
                        </Select>
                      </FormGroup>
                      {newRecord.type === 'MX' && (
                        <FormGroup>
                          <Label>Priority</Label>
                          <Input
                            type="number"
                            placeholder="10"
                            value={newRecord.priority || ''}
                            onChange={(e) => setNewRecord({ ...newRecord, priority: parseInt(e.target.value) })}
                          />
                        </FormGroup>
                      )}
                    </FormRow>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                      <CancelButton onClick={() => setShowAddRecord(false)}>Cancel</CancelButton>
                      <SubmitButton onClick={handleAddRecord}>Add Record</SubmitButton>
                    </div>
                  </div>
                ) : (
                  <AddRecordButton onClick={() => setShowAddRecord(true)}>
                    {Icons.plus}
                    Add DNS Record
                  </AddRecordButton>
                )}
              </DNSSection>

              <SSLSection>
                <SSLHeader>
                  <SSLTitle>
                    {Icons.projects}
                    Project Connection
                  </SSLTitle>
                  <SSLStatus $active={!!selectedDomain.project_id}>
                    {selectedDomain.projects?.name || 'Not Connected'}
                  </SSLStatus>
                </SSLHeader>
                <SSLInfo style={{ marginBottom: '12px' }}>
                  {selectedDomain.project_id
                    ? `This domain is connected to "${selectedDomain.projects?.name}".`
                    : 'Connect this domain to a project to serve your application.'}
                </SSLInfo>
                {selectedDomain.project_id ? (
                  <CancelButton onClick={() => handleConnectProject(selectedDomain.id, null)}>
                    Disconnect from Project
                  </CancelButton>
                ) : (
                  <Select
                    value=""
                    onChange={(e) => {
                      if (e.target.value) {
                        handleConnectProject(selectedDomain.id, e.target.value);
                      }
                    }}
                    style={{ maxWidth: '300px' }}
                  >
                    <option value="">Select a project to connect...</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </Select>
                )}
              </SSLSection>

              <SSLSection>
                <SSLHeader>
                  <SSLTitle>
                    {Icons.lock}
                    SSL Certificate
                  </SSLTitle>
                  <SSLStatus $active={selectedDomain.ssl_status === 'active'}>
                    {selectedDomain.ssl_status === 'active' ? 'Active' : 'Pending Verification'}
                  </SSLStatus>
                </SSLHeader>
                <SSLInfo>
                  {selectedDomain.ssl_status === 'active'
                    ? 'Your SSL certificate is active and will auto-renew.'
                    : 'SSL certificate will be issued automatically once domain is verified.'}
                </SSLInfo>
              </SSLSection>
            </ModalBody>
            <ModalFooter>
              <DeleteButton onClick={() => handleDeleteDomain(selectedDomain)}>
                Delete Domain
              </DeleteButton>
              <div style={{ flex: 1 }} />
              <CancelButton onClick={() => setShowConfigModal(false)}>
                Close
              </CancelButton>
              <SubmitButton onClick={() => setShowConfigModal(false)}>
                Save Changes
              </SubmitButton>
            </ModalFooter>
          </Modal>
        </ModalOverlay>
      )}
    </DashboardLayout>
  );
}
