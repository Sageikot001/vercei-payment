import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createAdminClient();

    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', session.user.email)
      .single();

    if (!profile) {
      return NextResponse.json({
        projects: 0,
        deployments: 0,
        domains: 0,
        storage: 0,
      });
    }

    // Get project count
    const { count: projectCount } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', profile.id)
      .eq('status', 'active');

    // Get deployment count (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { count: deploymentCount } = await supabase
      .from('deployments')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', profile.id)
      .gte('created_at', thirtyDaysAgo.toISOString());

    // Get domain count
    const { count: domainCount } = await supabase
      .from('domains')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', profile.id);

    // Get recent activity
    const { data: recentDeployments } = await supabase
      .from('deployments')
      .select(`
        id,
        commit_message,
        status,
        type,
        created_at,
        projects (name)
      `)
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(5);

    return NextResponse.json({
      projects: projectCount || 0,
      deployments: deploymentCount || 0,
      domains: domainCount || 0,
      storage: 0, // Placeholder - would calculate from actual storage usage
      recentActivity: recentDeployments?.map((d) => {
        const projectData = d.projects as unknown as { name: string } | null;
        return {
          id: d.id,
          message: d.commit_message || 'Deployment',
          project: projectData?.name || 'Unknown',
          status: d.status,
          type: d.type,
          time: formatTimeAgo(new Date(d.created_at)),
        };
      }) || [],
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}
