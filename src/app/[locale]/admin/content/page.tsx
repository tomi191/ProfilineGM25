import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { readFileSync } from 'fs';
import path from 'path';
import AdminShell from '@/components/admin/AdminShell';
import ContentEditor from '@/components/admin/ContentEditor';

export default async function ContentPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect(`/${locale}/admin/login`);
  }

  // Fetch all site_content rows from Supabase
  const { data: siteContent } = await supabase
    .from('site_content')
    .select('*');

  // Read default translations from JSON files
  let bgDefaults: Record<string, unknown> = {};
  let enDefaults: Record<string, unknown> = {};

  try {
    const bgPath = path.join(process.cwd(), 'messages', 'bg.json');
    bgDefaults = JSON.parse(readFileSync(bgPath, 'utf-8'));
  } catch {
    // bg.json not found — use empty object
  }

  try {
    const enPath = path.join(process.cwd(), 'messages', 'en.json');
    enDefaults = JSON.parse(readFileSync(enPath, 'utf-8'));
  } catch {
    // en.json not found — use empty object
  }

  return (
    <AdminShell locale={locale}>
      <ContentEditor
        siteContent={siteContent ?? []}
        defaults={{ bg: bgDefaults, en: enDefaults }}
        locale={locale}
      />
    </AdminShell>
  );
}
