import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import InquiriesTable from '@/components/admin/InquiriesTable';
import AdminShell from '@/components/admin/AdminShell';

export default async function InquiriesPage({
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
          <h1 className="text-2xl font-bold text-white">All Inquiries</h1>
          <p className="mt-1 text-sm text-gray-500">
            View, filter, and manage all B2B inquiries.
          </p>
        </div>

        <InquiriesTable inquiries={rows} locale={locale} />
      </div>
    </AdminShell>
  );
}
