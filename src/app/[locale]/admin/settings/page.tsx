import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import SettingsPanel from '@/components/admin/SettingsPanel';

export default async function SettingsPage({
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

  // Fetch admin_settings for current user
  const { data: settingsRow } = await supabase
    .from('admin_settings')
    .select('email_on_inquiry, push_enabled, followup_reminders')
    .eq('user_id', session.user.id)
    .single();

  const settings = {
    email_on_inquiry: settingsRow?.email_on_inquiry ?? true,
    push_enabled: settingsRow?.push_enabled ?? false,
    followup_reminders: settingsRow?.followup_reminders ?? true,
  };

  // Fetch email templates
  const { data: templates } = await supabase
    .from('email_templates')
    .select('id, name, subject, body, locale')
    .order('locale')
    .order('name');

  return (
    <AdminShell locale={locale}>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your profile, notifications, and email templates.
          </p>
        </div>

        <SettingsPanel
          settings={settings}
          templates={templates ?? []}
          userEmail={session.user.email ?? ''}
          locale={locale}
        />
      </div>
    </AdminShell>
  );
}
