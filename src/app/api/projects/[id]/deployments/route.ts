import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const branch = searchParams.get('branch');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('deployments')
      .select('*', { count: 'exact' })
      .eq('project_id', params.id)
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (type && type !== 'all') {
      query = query.eq('type', type);
    }
    if (branch && branch !== 'all') {
      query = query.eq('branch', branch);
    }

    const { data: deployments, error, count } = await query;

    if (error) {
      console.error('Error fetching deployments:', error);
      return NextResponse.json({ error: 'Failed to fetch deployments' }, { status: 500 });
    }

    return NextResponse.json({
      deployments: deployments.map((d) => ({
        id: d.id,
        commit: d.commit_message || 'No commit message',
        commitHash: d.commit_hash || d.id.slice(0, 7),
        branch: d.branch,
        time: formatTimeAgo(new Date(d.created_at)),
        duration: d.build_duration ? formatDuration(d.build_duration) : '—',
        status: d.status,
        type: d.type,
        url: d.url,
      })),
      total: count,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const supabase = createAdminClient();

    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', session.user.email)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify project ownership
    const { data: project } = await supabase
      .from('projects')
      .select('id, name')
      .eq('id', params.id)
      .eq('user_id', profile.id)
      .single();

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const { data: deployment, error } = await supabase
      .from('deployments')
      .insert({
        project_id: params.id,
        user_id: profile.id,
        branch: body.branch || 'main',
        type: body.type || 'preview',
        commit_hash: body.commitHash,
        commit_message: body.commitMessage || 'Manual deployment',
        status: 'queued',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating deployment:', error);
      return NextResponse.json({ error: 'Failed to create deployment' }, { status: 500 });
    }

    // Simulate build process (in production, this would trigger actual build)
    simulateBuild(supabase, deployment.id, project.name);

    return NextResponse.json({ deployment });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function simulateBuild(supabase: ReturnType<typeof createAdminClient>, deploymentId: string, projectName: string) {
  // Update to building
  await supabase
    .from('deployments')
    .update({ status: 'building' })
    .eq('id', deploymentId);

  // Simulate build time (5-15 seconds)
  const buildTime = Math.floor(Math.random() * 10000) + 5000;

  setTimeout(async () => {
    const success = Math.random() > 0.1; // 90% success rate

    await supabase
      .from('deployments')
      .update({
        status: success ? 'ready' : 'error',
        build_duration: Math.floor(buildTime / 1000),
        url: success ? `${projectName}-${deploymentId.slice(0, 8)}.vercei.app` : null,
      })
      .eq('id', deploymentId);
  }, buildTime);
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}
