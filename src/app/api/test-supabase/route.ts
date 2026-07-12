import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  try {
    const supabase = createAdminClient();

    // Test 1: Check connection by listing tables
    const { error: profilesError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    if (profilesError) {
      return NextResponse.json({
        connected: false,
        error: `Profiles table error: ${profilesError.message}`,
        hint: profilesError.hint || 'Table may not exist - did you run the migration SQL?',
      });
    }

    // Test 2: Check all tables exist
    const tables = ['profiles', 'subscriptions', 'projects', 'deployments', 'domains', 'environment_variables'];
    const tableStatus: Record<string, boolean> = {};

    for (const table of tables) {
      const { error } = await supabase.from(table).select('count').limit(1);
      tableStatus[table] = !error;
    }

    // Test 3: Count records
    const { count: profileCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    const { count: subscriptionCount } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true });

    const { count: projectCount } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({
      connected: true,
      tables: tableStatus,
      counts: {
        profiles: profileCount || 0,
        subscriptions: subscriptionCount || 0,
        projects: projectCount || 0,
      },
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    });
  } catch (error) {
    return NextResponse.json({
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
