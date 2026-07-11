import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; domainId: string } }
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
      .select('*')
      .eq('id', params.domainId)
      .eq('project_id', params.id)
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
  { params }: { params: { id: string; domainId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { isPrimary, verify } = body;

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
      .eq('id', params.domainId)
      .eq('project_id', params.id)
      .eq('user_id', profile.id)
      .single();

    if (!existingDomain) {
      return NextResponse.json({ error: 'Domain not found' }, { status: 404 });
    }

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    // Handle set as primary
    if (isPrimary !== undefined) {
      if (isPrimary) {
        // Unset other primary domains first
        await supabase
          .from('domains')
          .update({ is_primary: false })
          .eq('project_id', params.id)
          .eq('user_id', profile.id);
      }
      updates.is_primary = isPrimary;
    }

    // Handle verification request
    if (verify) {
      // In production, you would actually verify DNS records here
      // For now, we'll simulate successful verification
      updates.verified = true;
      updates.ssl_status = 'active';
    }

    const { data: domain, error } = await supabase
      .from('domains')
      .update(updates)
      .eq('id', params.domainId)
      .eq('user_id', profile.id)
      .select()
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
  { params }: { params: { id: string; domainId: string } }
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

    // Check if domain exists and is not the only primary
    const { data: domain } = await supabase
      .from('domains')
      .select('is_primary')
      .eq('id', params.domainId)
      .eq('project_id', params.id)
      .eq('user_id', profile.id)
      .single();

    if (!domain) {
      return NextResponse.json({ error: 'Domain not found' }, { status: 404 });
    }

    if (domain.is_primary) {
      // Check if there are other domains to promote
      const { data: otherDomains } = await supabase
        .from('domains')
        .select('id')
        .eq('project_id', params.id)
        .eq('user_id', profile.id)
        .neq('id', params.domainId)
        .limit(1);

      if (!otherDomains || otherDomains.length === 0) {
        return NextResponse.json(
          { error: 'Cannot delete the only domain. Add another domain first.' },
          { status: 400 }
        );
      }

      // Promote the first other domain to primary
      await supabase
        .from('domains')
        .update({ is_primary: true })
        .eq('id', otherDomains[0].id);
    }

    const { error } = await supabase
      .from('domains')
      .delete()
      .eq('id', params.domainId)
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
