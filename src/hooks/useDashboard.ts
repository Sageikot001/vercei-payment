'use client';

import { useState, useEffect, useCallback } from 'react';

interface PlanLimits {
  storageGb: number;
  customDomains: number;
  bandwidth: string;
  buildMinutes: number;
  teamMembers: number;
}

interface DashboardStats {
  projects: number;
  deployments: number;
  domains: number;
  storage: number;
  plan: 'basic' | 'standard' | 'premium' | null;
  limits: PlanLimits | null;
  recentActivity: Activity[];
}

interface Activity {
  id: string;
  message: string;
  project: string;
  status: string;
  type: string;
  time: string;
}

interface UseDashboardReturn {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDashboard(): UseDashboardReturn {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/dashboard/stats');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch dashboard stats');
      }

      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}
