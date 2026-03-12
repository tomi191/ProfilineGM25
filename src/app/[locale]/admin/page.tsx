import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import StatsCards from '@/components/admin/StatsCards';
import InquiriesTable from '@/components/admin/InquiriesTable';
import AdminShell from '@/components/admin/AdminShell';

export default async function AdminDashboardPage({
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

  const { data: inquiries, error } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false });

  const rows = inquiries ?? [];

  // Stats
  const newCount = rows.filter((i) => i.status === 'new').length;

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const contactedThisMonth = rows.filter(
    (i) => i.status === 'contacted' && i.created_at >= monthStart
  ).length;

  const totalCount = rows.length;

  return (
    <AdminShell locale={locale}>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Inquiries Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage incoming B2B inquiries for Profiline GM25.
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
            Failed to load inquiries: {error.message}
          </div>
        )}

        <StatsCards
          newCount={newCount}
          contactedThisMonth={contactedThisMonth}
          totalCount={totalCount}
        />

        <InquiriesTable inquiries={rows} />
      </div>
    </AdminShell>
  );
}
