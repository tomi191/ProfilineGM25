import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';

export default async function AnalyticsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect(`/${locale}/admin/login`);
  }

  const { data: inquiries } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false });

  const rows = inquiries ?? [];

  return (
    <AdminShell locale={locale}>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Visual insights into your B2B inquiry pipeline.
          </p>
        </div>

        <AnalyticsDashboard inquiries={rows} />
      </div>
    </AdminShell>
  );
}
