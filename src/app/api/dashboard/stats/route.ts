import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatTimeAgo } from '@/lib/utils/time';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createAdminClient();

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', session.user.email)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Profile lookup error:', profileError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (!profile) {
      return NextResponse.json({
        projects: 0,
        deployments: 0,
        domains: 0,
        storage: 0,
        recentActivity: [],
      });
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Execute queries in parallel
    const [projectResult, deploymentResult, domainResult, activityResult] = await Promise.all([
      supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', profile.id)
        .eq('status', 'active'),
      supabase
        .from('deployments')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', profile.id)
        .gte('created_at', thirtyDaysAgo.toISOString()),
      supabase
        .from('domains')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', profile.id),
      supabase
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
        .limit(5),
    ]);

    // Check for errors
    if (projectResult.error || deploymentResult.error || domainResult.error || activityResult.error) {
      console.error('Stats query errors:', {
        project: projectResult.error,
        deployment: deploymentResult.error,
        domain: domainResult.error,
        activity: activityResult.error,
      });
      return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }

    return NextResponse.json({
      projects: projectResult.count || 0,
      deployments: deploymentResult.count || 0,
      domains: domainResult.count || 0,
      storage: 0,
      recentActivity: activityResult.data?.map((d) => {
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
