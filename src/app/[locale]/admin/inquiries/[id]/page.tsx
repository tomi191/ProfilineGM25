import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import InquiryDetail from '@/components/admin/InquiryDetail';

export default async function InquiryDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;

  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect(`/${locale}/admin/login`);
  }

  const { data: inquiry } = await supabase
    .from('inquiries')
    .select('*')
    .eq('id', id)
    .single();

  if (!inquiry) {
    notFound();
  }

  const { data: activities } = await supabase
    .from('inquiry_activity')
    .select('*')
    .eq('inquiry_id', id)
    .order('created_at', { ascending: false });

  const { data: notes } = await supabase
    .from('inquiry_notes')
    .select('*')
    .eq('inquiry_id', id)
    .order('created_at', { ascending: false });

  return (
    <AdminShell locale={locale}>
      <InquiryDetail
        inquiry={inquiry}
        activities={activities ?? []}
        notes={notes ?? []}
        locale={locale}
      />
    </AdminShell>
  );
}
