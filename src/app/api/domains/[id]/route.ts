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

    const { data: domain, error } = await supabase
      .from('domains')
      .select(`
        *,
        projects (
          id,
          name
        )
      `)
      .eq('id', params.id)
      .eq('user_id', profile.id)
      .single();

    if (error || !domain) {
      return NextResponse.json({ error: 'Domain not found' }, { status: 404 });
    }

    return NextResponse.json({ domain });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { projectId, isPrimary, verify, disconnect } = body;

    const supabase = createAdminClient();

    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', session.user.email)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify domain ownership
    const { data: existingDomain } = await supabase
      .from('domains')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', profile.id)
      .single();

    if (!existingDomain) {
      return NextResponse.json({ error: 'Domain not found' }, { status: 404 });
    }

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    // Handle disconnect from project
    if (disconnect) {
      updates.project_id = null;
      updates.is_primary = false;
    }

    // Handle connect to project
    if (projectId !== undefined && !disconnect) {
      if (projectId) {
        // Verify project ownership
        const { data: project } = await supabase
          .from('projects')
          .select('id')
          .eq('id', projectId)
          .eq('user_id', profile.id)
          .neq('status', 'deleted')
          .single();

        if (!project) {
          return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }
      }
      updates.project_id = projectId || null;
    }

    // Handle set as primary
    if (isPrimary !== undefined) {
      const targetProjectId = projectId || existingDomain.project_id;
      if (isPrimary && targetProjectId) {
        // Unset other primary domains for this project
        await supabase
          .from('domains')
          .update({ is_primary: false })
          .eq('project_id', targetProjectId)
          .eq('user_id', profile.id);
      }
      updates.is_primary = isPrimary;
    }

    // Handle verification request
    if (verify) {
      updates.verified = true;
      updates.ssl_status = 'active';
    }

    const { data: domain, error } = await supabase
      .from('domains')
      .update(updates)
      .eq('id', params.id)
      .eq('user_id', profile.id)
      .select(`
        *,
        projects (
          id,
          name
        )
      `)
      .single();

    if (error) {
      console.error('Error updating domain:', error);
      return NextResponse.json({ error: 'Failed to update domain' }, { status: 500 });
    }

    return NextResponse.json({ domain });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
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

    const { error } = await supabase
      .from('domains')
      .delete()
      .eq('id', params.id)
      .eq('user_id', profile.id);

    if (error) {
      console.error('Error deleting domain:', error);
      return NextResponse.json({ error: 'Failed to delete domain' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
