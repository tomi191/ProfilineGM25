'use client';

import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { exportToCSV } from '@/lib/export-csv';
import {
  User,
  Bell,
  Mail,
  Shield,
  Trash2,
  Plus,
  Edit3,
  Save,
  X,
  Download,
  AlertTriangle,
} from 'lucide-react';

/* ---------- Types ---------- */

interface AdminSettings {
  email_on_inquiry: boolean;
  push_enabled: boolean;
  followup_reminders: boolean;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  locale: string;
}

interface Props {
  settings: AdminSettings;
  templates: EmailTemplate[];
  userEmail: string;
  locale: string;
}

/* ---------- Toggle Switch ---------- */

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-lg px-1 py-2">
      <div>
        <p className="text-sm font-medium text-gray-200">{label}</p>
        {description && (
          <p className="text-xs text-gray-500">{description}</p>
        )}
      </div>
      <div className="relative shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <div className="h-6 w-11 rounded-full bg-[#333] transition-colors peer-checked:bg-lime-500" />
        <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
      </div>
    </label>
  );
}

/* ---------- Section Card ---------- */

function SectionCard({
  title,
  icon: Icon,
  children,
  danger,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-6 ${
        danger
          ? 'border-red-500/40 bg-[#111]'
          : 'border-[#333] bg-[#111]'
      }`}
    >
      <div className="mb-5 flex items-center gap-2.5">
        <Icon
          className={`h-5 w-5 ${danger ? 'text-red-400' : 'text-lime-400'}`}
        />
        <h2
          className={`text-lg font-semibold ${
            danger ? 'text-red-400' : 'text-white'
          }`}
        >
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

/* ---------- Main Component ---------- */

export default function SettingsPanel({
  settings: initialSettings,
  templates: initialTemplates,
  userEmail,
}: Props) {
  const supabase = createClient();

  /* ---- Profile state ---- */
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  /* ---- Notification state ---- */
  const [settings, setSettings] = useState<AdminSettings>(initialSettings);
  const [settingsSaving, setSettingsSaving] = useState(false);

  /* ---- Templates state ---- */
  const [templates, setTemplates] =
    useState<EmailTemplate[]>(initialTemplates);
  const [activeLocaleTab, setActiveLocaleTab] = useState<string>('bg');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    subject: '',
    body: '',
    locale: 'bg',
  });
  const [templateMsg, setTemplateMsg] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  /* ---- Danger zone state ---- */
  const [dangerMsg, setDangerMsg] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [dangerLoading, setDangerLoading] = useState(false);

  /* ======== Profile Handlers ======== */

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({
        type: 'error',
        text: 'Password must be at least 6 characters.',
      });
      return;
    }

    setPasswordLoading(true);

    // Re-authenticate with current password
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: userEmail,
      password: currentPassword,
    });

    if (signInError) {
      setPasswordMsg({
        type: 'error',
        text: 'Current password is incorrect.',
      });
      setPasswordLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    setPasswordLoading(false);

    if (error) {
      setPasswordMsg({ type: 'error', text: error.message });
    } else {
      setPasswordMsg({
        type: 'success',
        text: 'Password updated successfully.',
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordForm(false);
    }
  }

  /* ======== Notification Handlers ======== */

  const saveSettings = useCallback(
    async (updated: AdminSettings) => {
      setSettingsSaving(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        await supabase.from('admin_settings').upsert(
          {
            user_id: session.user.id,
            ...updated,
          },
          { onConflict: 'user_id' }
        );
      }
      setSettingsSaving(false);
    },
    [supabase]
  );

  function handleToggle(key: keyof AdminSettings, value: boolean) {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    saveSettings(updated);
  }

  /* ======== Template Handlers ======== */

  function startEdit(template: EmailTemplate) {
    setEditingId(template.id);
    setEditForm({
      name: template.name,
      subject: template.subject,
      body: template.body,
      locale: template.locale,
    });
    setTemplateMsg(null);
  }

  function startAdd() {
    const tempId = `new-${Date.now()}`;
    setEditingId(tempId);
    setEditForm({ name: '', subject: '', body: '', locale: activeLocaleTab });
    setTemplateMsg(null);
  }

  function cancelEdit() {
    // Remove unsaved new templates
    setTemplates((prev) => prev.filter((t) => !t.id.startsWith('new-')));
    setEditingId(null);
    setTemplateMsg(null);
  }

  async function saveTemplate() {
    if (!editForm.name.trim() || !editForm.subject.trim()) {
      setTemplateMsg({ type: 'error', text: 'Name and subject are required.' });
      return;
    }

    setTemplateMsg(null);

    if (editingId?.startsWith('new-')) {
      // Insert
      const { data, error } = await supabase
        .from('email_templates')
        .insert({
          name: editForm.name,
          subject: editForm.subject,
          body: editForm.body,
          locale: editForm.locale,
        })
        .select()
        .single();

      if (error) {
        setTemplateMsg({ type: 'error', text: error.message });
        return;
      }

      setTemplates((prev) =>
        prev
          .filter((t) => !t.id.startsWith('new-'))
          .concat(data as EmailTemplate)
      );
    } else {
      // Update
      const { error } = await supabase
        .from('email_templates')
        .update({
          name: editForm.name,
          subject: editForm.subject,
          body: editForm.body,
          locale: editForm.locale,
        })
        .eq('id', editingId!);

      if (error) {
        setTemplateMsg({ type: 'error', text: error.message });
        return;
      }

      setTemplates((prev) =>
        prev.map((t) =>
          t.id === editingId ? { ...t, ...editForm } : t
        )
      );
    }

    setEditingId(null);
    setTemplateMsg({ type: 'success', text: 'Template saved.' });
  }

  async function deleteTemplate(id: string) {
    if (!window.confirm('Are you sure you want to delete this template?'))
      return;

    const { error } = await supabase
      .from('email_templates')
      .delete()
      .eq('id', id);

    if (error) {
      setTemplateMsg({ type: 'error', text: error.message });
      return;
    }

    setTemplates((prev) => prev.filter((t) => t.id !== id));
    setTemplateMsg({ type: 'success', text: 'Template deleted.' });
  }

  /* ======== Danger Zone Handlers ======== */

  async function handleExportCSV() {
    setDangerLoading(true);
    setDangerMsg(null);

    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    setDangerLoading(false);

    if (error) {
      setDangerMsg({ type: 'error', text: error.message });
      return;
    }

    if (!data || data.length === 0) {
      setDangerMsg({ type: 'error', text: 'No inquiries to export.' });
      return;
    }

    exportToCSV(data, `inquiries-${new Date().toISOString().slice(0, 10)}.csv`);
    setDangerMsg({ type: 'success', text: 'CSV exported successfully.' });
  }

  async function handleDeleteTestInquiries() {
    if (
      !window.confirm(
        'This will permanently delete all inquiries with "test" or "example" in the email address. Continue?'
      )
    )
      return;

    setDangerLoading(true);
    setDangerMsg(null);

    // Delete inquiries where email contains 'test' or 'example'
    const { error: err1 } = await supabase
      .from('inquiries')
      .delete()
      .ilike('email', '%test%');

    const { error: err2 } = await supabase
      .from('inquiries')
      .delete()
      .ilike('email', '%example%');

    setDangerLoading(false);

    if (err1 || err2) {
      setDangerMsg({
        type: 'error',
        text: (err1?.message || '') + ' ' + (err2?.message || ''),
      });
      return;
    }

    setDangerMsg({
      type: 'success',
      text: 'Test inquiries deleted successfully.',
    });
  }

  /* ======== Derived data ======== */

  const locales = ['bg', 'en'];
  const filteredTemplates = templates.filter(
    (t) => t.locale === activeLocaleTab
  );

  /* ======== Render ======== */

  const inputClass =
    'w-full rounded-lg border border-[#333] bg-[#0a0a0a] px-3 py-2 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-lime-500/50 focus:ring-1 focus:ring-lime-500/30';

  return (
    <div className="flex flex-col gap-6">
      {/* ---- Section 1: Profile ---- */}
      <SectionCard title="Profile" icon={User}>
        <div className="flex flex-col gap-4">
          {/* Email display */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              Email
            </label>
            <p className="text-sm text-gray-400">{userEmail}</p>
          </div>

          {/* Password change */}
          {!showPasswordForm ? (
            <button
              type="button"
              onClick={() => setShowPasswordForm(true)}
              className="inline-flex w-fit items-center gap-2 rounded-lg border border-[#333] bg-[#222] px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-[#333] hover:text-white"
            >
              <Shield className="h-4 w-4" />
              Change Password
            </button>
          ) : (
            <form
              onSubmit={handlePasswordChange}
              className="flex max-w-md flex-col gap-3 rounded-lg border border-[#222] bg-[#0a0a0a] p-4"
            >
              <input
                type="password"
                placeholder="Current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className={inputClass}
              />
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className={inputClass}
              />
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={inputClass}
              />
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="inline-flex items-center gap-2 rounded-lg bg-lime-500/10 px-4 py-2 text-sm font-medium text-lime-400 transition-colors hover:bg-lime-500/20 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {passwordLoading ? 'Saving...' : 'Update Password'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordMsg(null);
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#333] px-4 py-2 text-sm text-gray-400 transition-colors hover:text-white"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
              </div>
            </form>
          )}

          {passwordMsg && (
            <p
              className={`text-sm ${
                passwordMsg.type === 'success'
                  ? 'text-lime-400'
                  : 'text-red-400'
              }`}
            >
              {passwordMsg.text}
            </p>
          )}
        </div>
      </SectionCard>

      {/* ---- Section 2: Notifications ---- */}
      <SectionCard title="Notifications" icon={Bell}>
        <div className="flex flex-col divide-y divide-[#222]">
          <Toggle
            checked={settings.email_on_inquiry}
            onChange={(v) => handleToggle('email_on_inquiry', v)}
            label="Email on new inquiry"
            description="Receive an email notification when a new inquiry is submitted."
          />
          <Toggle
            checked={settings.push_enabled}
            onChange={(v) => handleToggle('push_enabled', v)}
            label="Push notifications"
            description="Browser push notifications for new inquiries (coming soon)."
          />
          <Toggle
            checked={settings.followup_reminders}
            onChange={(v) => handleToggle('followup_reminders', v)}
            label="Follow-up reminders (48h)"
            description="Get reminded about unanswered inquiries after 48 hours."
          />
        </div>
        {settingsSaving && (
          <p className="mt-2 text-xs text-gray-500">Saving...</p>
        )}
      </SectionCard>

      {/* ---- Section 3: Email Templates ---- */}
      <SectionCard title="Email Templates" icon={Mail}>
        {/* Locale tabs */}
        <div className="mb-4 flex gap-1 rounded-lg bg-[#0a0a0a] p-1">
          {locales.map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => {
                setActiveLocaleTab(loc);
                setEditingId(null);
              }}
              className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                activeLocaleTab === loc
                  ? 'bg-[#222] text-white'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {loc.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Template list */}
        <div className="flex flex-col gap-3">
          {filteredTemplates.length === 0 && editingId === null && (
            <p className="py-4 text-center text-sm text-gray-500">
              No templates for {activeLocaleTab.toUpperCase()}.
            </p>
          )}

          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="rounded-lg border border-[#222] bg-[#0a0a0a] p-4"
            >
              {editingId === template.id ? (
                /* Edit mode */
                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    placeholder="Template name"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className={inputClass}
                  />
                  <input
                    type="text"
                    placeholder="Subject line"
                    value={editForm.subject}
                    onChange={(e) =>
                      setEditForm({ ...editForm, subject: e.target.value })
                    }
                    className={inputClass}
                  />
                  <div>
                    <textarea
                      placeholder="Email body..."
                      value={editForm.body}
                      onChange={(e) =>
                        setEditForm({ ...editForm, body: e.target.value })
                      }
                      rows={5}
                      className={`${inputClass} resize-y`}
                    />
                    <p className="mt-1 text-xs text-gray-600">
                      Variables: {'{{name}}'}, {'{{company}}'},{' '}
                      {'{{country}}'}, {'{{volume}}'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={saveTemplate}
                      className="inline-flex items-center gap-2 rounded-lg bg-lime-500/10 px-4 py-2 text-sm font-medium text-lime-400 transition-colors hover:bg-lime-500/20"
                    >
                      <Save className="h-4 w-4" />
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="inline-flex items-center gap-2 rounded-lg border border-[#333] px-4 py-2 text-sm text-gray-400 transition-colors hover:text-white"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* View mode */
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-200">
                      {template.name}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-gray-500">
                      Subject: {template.subject}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => startEdit(template)}
                      className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-[#222] hover:text-lime-400"
                      title="Edit"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteTemplate(template.id)}
                      className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-[#222] hover:text-red-400"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* New template in edit mode */}
          {editingId?.startsWith('new-') && (
            <div className="rounded-lg border border-lime-500/20 bg-[#0a0a0a] p-4">
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Template name"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className={inputClass}
                />
                <input
                  type="text"
                  placeholder="Subject line"
                  value={editForm.subject}
                  onChange={(e) =>
                    setEditForm({ ...editForm, subject: e.target.value })
                  }
                  className={inputClass}
                />
                <div>
                  <textarea
                    placeholder="Email body..."
                    value={editForm.body}
                    onChange={(e) =>
                      setEditForm({ ...editForm, body: e.target.value })
                    }
                    rows={5}
                    className={`${inputClass} resize-y`}
                  />
                  <p className="mt-1 text-xs text-gray-600">
                    Variables: {'{{name}}'}, {'{{company}}'},{' '}
                    {'{{country}}'}, {'{{volume}}'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={saveTemplate}
                    className="inline-flex items-center gap-2 rounded-lg bg-lime-500/10 px-4 py-2 text-sm font-medium text-lime-400 transition-colors hover:bg-lime-500/20"
                  >
                    <Save className="h-4 w-4" />
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#333] px-4 py-2 text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add Template button */}
          {!editingId && (
            <button
              type="button"
              onClick={startAdd}
              className="inline-flex w-fit items-center gap-2 rounded-lg border border-dashed border-[#333] px-4 py-2 text-sm font-medium text-gray-400 transition-colors hover:border-lime-500/40 hover:text-lime-400"
            >
              <Plus className="h-4 w-4" />
              Add Template
            </button>
          )}
        </div>

        {templateMsg && (
          <p
            className={`mt-3 text-sm ${
              templateMsg.type === 'success' ? 'text-lime-400' : 'text-red-400'
            }`}
          >
            {templateMsg.text}
          </p>
        )}
      </SectionCard>

      {/* ---- Section 4: Danger Zone ---- */}
      <SectionCard title="Danger Zone" icon={AlertTriangle} danger>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleExportCSV}
              disabled={dangerLoading}
              className="inline-flex items-center gap-2 rounded-lg border border-[#333] bg-[#222] px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-[#333] hover:text-white disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              Export All Data (CSV)
            </button>
            <button
              type="button"
              onClick={handleDeleteTestInquiries}
              disabled={dangerLoading}
              className="inline-flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete Test Inquiries
            </button>
          </div>

          {dangerMsg && (
            <p
              className={`text-sm ${
                dangerMsg.type === 'success' ? 'text-lime-400' : 'text-red-400'
              }`}
            >
              {dangerMsg.text}
            </p>
          )}
        </div>
      </SectionCard>
    </div>
  );
}
