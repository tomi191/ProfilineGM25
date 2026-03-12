import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import StatsCards from '@/components/admin/StatsCards';
import AdminShell from '@/components/admin/AdminShell';
import { ArrowRight, Download, BarChart3, AlertTriangle, Clock } from 'lucide-react';

const statusColors: Record<string, string> = {
  new: 'bg-lime-500/15 text-lime-400',
  contacted: 'bg-amber-500/15 text-amber-400',
  closed: 'bg-blue-500/15 text-blue-400',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function daysAgo(iso: string): number {
  const diff = Date.now() - new Date(iso).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

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
  const closedCount = rows.filter((i) => i.status === 'closed').length;
  const conversionRate = totalCount > 0
    ? `${((closedCount / totalCount) * 100).toFixed(1)}%`
    : '0%';

  // Recent inquiries — last 5
  const recentInquiries = rows.slice(0, 5);

  // Needs attention — status='new' AND older than 48 hours
  const fortyEightHoursAgo = Date.now() - 48 * 60 * 60 * 1000;
  const needsAttention = rows.filter(
    (i) => i.status === 'new' && new Date(i.created_at).getTime() < fortyEightHoursAgo
  );

  return (
    <AdminShell locale={locale}>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
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
          conversionRate={conversionRate}
        />

        {/* Grid layout: 2 columns on desktop, 1 on mobile */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* Recent Inquiries */}
          <div className="rounded-2xl border border-[#333] bg-[#111] p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Recent Inquiries</h2>

            {recentInquiries.length === 0 ? (
              <p className="text-sm text-gray-500">No inquiries yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#333] text-gray-400">
                      <th className="pb-2 pr-4 font-medium">Date</th>
                      <th className="pb-2 pr-4 font-medium">Name</th>
                      <th className="pb-2 pr-4 font-medium">Company</th>
                      <th className="pb-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentInquiries.map((inquiry) => (
                      <tr
                        key={inquiry.id}
                        className="border-b border-[#222] last:border-0"
                      >
                        <td className="whitespace-nowrap py-2.5 pr-4 text-gray-400">
                          {formatDate(inquiry.created_at)}
                        </td>
                        <td className="py-2.5 pr-4">
                          <Link
                            href={`/${locale}/admin/inquiries/${inquiry.id}`}
                            className="text-white hover:text-lime-400 transition-colors"
                          >
                            {inquiry.name}
                          </Link>
                        </td>
                        <td className="py-2.5 pr-4 text-gray-400">
                          {inquiry.company || '—'}
                        </td>
                        <td className="py-2.5">
                          <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[inquiry.status] || 'bg-gray-500/15 text-gray-400'}`}>
                            {inquiry.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-4 border-t border-[#222] pt-4">
              <Link
                href={`/${locale}/admin/inquiries`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-lime-400 transition-colors hover:text-lime-300"
              >
                View All Inquiries
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Needs Attention */}
          <div className="rounded-2xl border border-[#333] bg-[#111] p-6">
            <div className="mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
              <h2 className="text-lg font-semibold text-white">Needs Attention</h2>
            </div>

            {needsAttention.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="rounded-full bg-lime-500/10 p-3">
                  <Clock className="h-6 w-6 text-lime-400" />
                </div>
                <p className="mt-3 text-sm text-gray-400">
                  All caught up! No inquiries need attention.
                </p>
              </div>
            ) : (
              <ul className="flex flex-col gap-3">
                {needsAttention.map((inquiry) => {
                  const days = daysAgo(inquiry.created_at);
                  return (
                    <li
                      key={inquiry.id}
                      className="flex items-center justify-between rounded-lg border border-[#222] bg-[#0a0a0a] px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-white">{inquiry.name}</p>
                        <p className="text-xs text-gray-500">{inquiry.company || 'No company'}</p>
                      </div>
                      <span className="whitespace-nowrap text-xs text-amber-400">
                        {days} {days === 1 ? 'day' : 'days'} ago
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl border border-[#333] bg-[#111] p-6 lg:col-span-2">
            <h2 className="mb-4 text-lg font-semibold text-white">Quick Actions</h2>
            <div className="flex flex-wrap gap-3">
              <ExportCSVButton />
              <Link
                href={`/${locale}/admin/analytics`}
                className="inline-flex items-center gap-2 rounded-lg border border-[#333] bg-[#222] px-4 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-[#333] hover:text-white"
              >
                <BarChart3 className="h-4 w-4" />
                View Analytics
              </Link>
            </div>
          </div>

        </div>
      </div>
    </AdminShell>
  );
}

/* ---------- Client island for Export CSV button ---------- */

function ExportCSVButton() {
  return (
    <form
      action={async () => {
        'use server';
        console.log('[Admin] Export CSV clicked');
      }}
    >
      <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-lg bg-lime-500/10 px-4 py-2.5 text-sm font-medium text-lime-400 transition-colors hover:bg-lime-500/20"
      >
        <Download className="h-4 w-4" />
        Export CSV
      </button>
    </form>
  );
}
