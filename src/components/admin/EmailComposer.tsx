'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { X, Mail, Send, Loader2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  inquiry: {
    id: string;
    name: string;
    email: string;
    company: string | null;
    country: string | null;
    expected_volume: string | null;
  };
  onEmailSent: () => void;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  locale: string;
}

type Tab = 'templates' | 'custom';

export default function EmailComposer({ isOpen, onClose, inquiry, onEmailSent }: Props) {
  const [tab, setTab] = useState<Tab>('templates');
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const replaceVariables = useCallback(
    (text: string): string => {
      return text
        .replace(/\{\{name\}\}/g, inquiry.name || '')
        .replace(/\{\{company\}\}/g, inquiry.company || '')
        .replace(/\{\{country\}\}/g, inquiry.country || '')
        .replace(/\{\{volume\}\}/g, inquiry.expected_volume || '');
    },
    [inquiry]
  );

  useEffect(() => {
    if (!isOpen) return;

    async function fetchTemplates() {
      setLoadingTemplates(true);
      const supabase = createClient();
      const { data } = await supabase
        .from('email_templates')
        .select('*')
        .eq('locale', 'en');

      if (data) {
        setTemplates(data);
      }
      setLoadingTemplates(false);
    }

    fetchTemplates();
  }, [isOpen]);

  function handleTemplateClick(template: EmailTemplate) {
    setSubject(replaceVariables(template.subject));
    setBody(replaceVariables(template.body));
    setTab('custom');
  }

  async function handleSend() {
    if (!subject.trim() || !body.trim()) {
      setError('Subject and body are required.');
      return;
    }

    setSending(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: inquiry.email,
          subject: subject.trim(),
          body: body.trim(),
          inquiry_id: inquiry.id,
          inquiry_name: inquiry.name,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || 'Failed to send email.');
        setSending(false);
        return;
      }

      // Success
      alert('Email sent successfully!');
      setSubject('');
      setBody('');
      onClose();
      onEmailSent();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSending(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="mx-4 flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border border-[#333] bg-[#111]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#333] px-6 py-4">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-purple-400" />
            <h2 className="text-lg font-semibold text-white">Send Email to {inquiry.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-[#222] hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#333]">
          <button
            onClick={() => setTab('templates')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              tab === 'templates'
                ? 'border-b-2 border-lime-400 text-lime-400'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Templates
          </button>
          <button
            onClick={() => setTab('custom')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              tab === 'custom'
                ? 'border-b-2 border-lime-400 text-lime-400'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Custom
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {tab === 'templates' ? (
            <div className="flex flex-col gap-3">
              {loadingTemplates ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              ) : templates.length === 0 ? (
                <div className="py-8 text-center text-sm text-gray-500">
                  No templates found. Switch to Custom tab to compose manually.
                </div>
              ) : (
                templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateClick(template)}
                    className="rounded-xl border border-[#333] bg-[#1a1a1a] p-4 text-left transition-colors hover:border-lime-400/40 hover:bg-[#222]"
                  >
                    <p className="text-sm font-medium text-white">{template.name}</p>
                    <p className="mt-1 text-xs text-gray-400">Subject: {template.subject}</p>
                  </button>
                ))
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-500">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Email subject..."
                  className="w-full rounded-lg border border-[#444] bg-[#222] px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-lime-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-500">
                  Body
                </label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Write your email..."
                  className="min-h-[200px] w-full resize-y rounded-lg border border-[#444] bg-[#222] px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-lime-500"
                />
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between border-t border-[#333] px-6 py-4">
          <div className="text-sm text-gray-400">
            To: <span className="text-gray-300">{inquiry.email}</span>
          </div>
          <button
            onClick={handleSend}
            disabled={sending || !subject.trim() || !body.trim()}
            className="inline-flex items-center gap-2 rounded-lg border border-lime-400/60 px-5 py-2.5 text-sm font-medium text-lime-400 transition-colors hover:bg-lime-400/10 disabled:opacity-50"
          >
            {sending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
