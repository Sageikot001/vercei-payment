import { NextRequest, NextResponse } from 'next/server';
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
      return NextResponse.json({ projects: [] });
    }

    const { data: projects, error } = await supabase
      .from('projects')
      .select(`
        *,
        deployments (
          id,
          status,
          type,
          created_at
        ),
        domains (
          domain,
          is_primary
        )
      `)
      .eq('user_id', profile.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
      return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }

    const formattedProjects = projects.map((project) => {
      const latestDeployment = project.deployments?.[0];
      const primaryDomain = project.domains?.find((d: { is_primary: boolean }) => d.is_primary);

      return {
        id: project.id,
        name: project.name,
        url: primaryDomain?.domain || `${project.name}.vercei.app`,
        status: latestDeployment?.status === 'ready' ? 'live' :
                latestDeployment?.status === 'building' ? 'building' : 'inactive',
        lastDeployed: latestDeployment?.created_at
          ? formatTimeAgo(new Date(latestDeployment.created_at))
          : 'Never',
        framework: project.framework,
      };
    });

    return NextResponse.json({ projects: formattedProjects });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, framework, gitUrl, buildCommand, outputDirectory, installCommand } = body;

    if (!name) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', session.user.email)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        user_id: profile.id,
        name: name.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        framework: framework || 'nextjs',
        git_url: gitUrl || null,
        build_command: buildCommand || 'npm run build',
        output_directory: outputDirectory || '.next',
        install_command: installCommand || 'npm install',
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Project name already exists' }, { status: 400 });
      }
      console.error('Error creating project:', error);
      return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }

    // Create default domain
    await supabase.from('domains').insert({
      project_id: project.id,
      user_id: profile.id,
      domain: `${project.name}.vercei.app`,
      is_primary: true,
      verified: true,
      ssl_status: 'active',
    });

    // Create initial deployment
    await supabase.from('deployments').insert({
      project_id: project.id,
      user_id: profile.id,
      branch: 'main',
      status: 'queued',
      type: 'production',
      commit_message: 'Initial deployment',
    });

    return NextResponse.json({ project });
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
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
}
