'use client';

import { useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Plus,
  RefreshCw,
  MessageSquare,
  Mail,
  Trash2,
  Send,
  StickyNote,
  ChevronDown,
} from 'lucide-react';
import EmailComposer from './EmailComposer';

type Status = 'new' | 'contacted' | 'closed';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  company: string | null;
  country: string | null;
  expected_volume: string | null;
  message: string | null;
  locale: string | null;
  status: Status;
  created_at: string;
}

interface Activity {
  id: string;
  inquiry_id: string;
  type: string;
  metadata: Record<string, unknown>;
  created_by: string | null;
  created_at: string;
}

interface Note {
  id: string;
  inquiry_id: string;
  content: string;
  created_by: string | null;
  created_at: string;
}

interface Props {
  inquiry: Inquiry;
  activities: Activity[];
  notes: Note[];
  locale: string;
}

function relativeTime(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diff = now - then;

  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return 'just now';

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`;

  const years = Math.floor(months / 12);
  return `${years} year${years === 1 ? '' : 's'} ago`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface TimelineEntry {
  id: string;
  type: string;
  content?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  created_by: string | null;
}

function TimelineIcon({ type }: { type: string }) {
  switch (type) {
    case 'created':
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20">
          <Plus className="h-4 w-4 text-green-400" />
        </div>
      );
    case 'status_change':
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20">
          <RefreshCw className="h-4 w-4 text-blue-400" />
        </div>
      );
    case 'note_added':
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500/20">
          <MessageSquare className="h-4 w-4 text-yellow-400" />
        </div>
      );
    case 'email_sent':
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/20">
          <Mail className="h-4 w-4 text-purple-400" />
        </div>
      );
    default:
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-500/20">
          <Plus className="h-4 w-4 text-gray-400" />
        </div>
      );
  }
}

function typeLabel(type: string): string {
  switch (type) {
    case 'created':
      return 'Inquiry Created';
    case 'status_change':
      return 'Status Changed';
    case 'note_added':
      return 'Note Added';
    case 'email_sent':
      return 'Email Sent';
    default:
      return type;
  }
}

export default function InquiryDetail({ inquiry, activities, notes, locale }: Props) {
  const router = useRouter();
  const noteFormRef = useRef<HTMLDivElement>(null);

  const [status, setStatus] = useState<Status>(inquiry.status);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);
  const [localActivities, setLocalActivities] = useState<Activity[]>(activities);
  const [localNotes, setLocalNotes] = useState<Note[]>(notes);
  const [deleting, setDeleting] = useState(false);
  const [isEmailOpen, setIsEmailOpen] = useState(false);

  async function handleStatusChange(newStatus: Status) {
    if (newStatus === status) return;
    setUpdatingStatus(true);

    const oldStatus = status;
    const supabase = createClient();

    const { error } = await supabase
      .from('inquiries')
      .update({ status: newStatus })
      .eq('id', inquiry.id);

    if (!error) {
      // Insert activity record
      const { data: activityData } = await supabase
        .from('inquiry_activity')
        .insert({
          inquiry_id: inquiry.id,
          type: 'status_change',
          metadata: { from: oldStatus, to: newStatus },
        })
        .select()
        .single();

      setStatus(newStatus);

      if (activityData) {
        setLocalActivities((prev) => [activityData, ...prev]);
      }
    }

    setUpdatingStatus(false);
  }

  async function handleAddNote() {
    if (!noteContent.trim()) return;
    setSubmittingNote(true);

    const supabase = createClient();

    const { data: noteData, error: noteError } = await supabase
      .from('inquiry_notes')
      .insert({
        inquiry_id: inquiry.id,
        content: noteContent.trim(),
      })
      .select()
      .single();

    if (!noteError && noteData) {
      setLocalNotes((prev) => [noteData, ...prev]);

      // Also insert activity
      const { data: activityData } = await supabase
        .from('inquiry_activity')
        .insert({
          inquiry_id: inquiry.id,
          type: 'note_added',
          metadata: { note_id: noteData.id },
        })
        .select()
        .single();

      if (activityData) {
        setLocalActivities((prev) => [activityData, ...prev]);
      }

      setNoteContent('');
    }

    setSubmittingNote(false);
  }

  function handleSendEmail() {
    setIsEmailOpen(true);
  }

  function handleEmailSent() {
    // Refetch activities by reloading the page data
    router.refresh();
  }

  function scrollToNoteForm() {
    noteFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete this inquiry from ${inquiry.name}? This action cannot be undone.`
    );
    if (!confirmed) return;

    setDeleting(true);
    const supabase = createClient();
    const { error } = await supabase.from('inquiries').delete().eq('id', inquiry.id);

    if (!error) {
      router.push(`/${locale}/admin/inquiries`);
    } else {
      setDeleting(false);
    }
  }

  // Merge activities and notes into a single timeline
  const timelineEntries: TimelineEntry[] = [
    ...localActivities.map((a) => ({
      id: a.id,
      type: a.type,
      metadata: a.metadata,
      created_at: a.created_at,
      created_by: a.created_by,
    })),
    ...localNotes.map((n) => ({
      id: `note-${n.id}`,
      type: 'note_added' as const,
      content: n.content,
      created_at: n.created_at,
      created_by: n.created_by,
    })),
  ];

  // Deduplicate: if an activity of type 'note_added' exists and a note with matching id exists, keep only the note version
  const deduped: TimelineEntry[] = [];

  for (const entry of timelineEntries) {
    // Skip activity entries for notes (we use the note entry with content instead)
    if (entry.type === 'note_added' && entry.metadata?.note_id && !entry.content) {
      continue;
    }
    deduped.push(entry);
  }

  // Sort by created_at descending
  deduped.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const statusColors: Record<Status, string> = {
    new: 'bg-lime-500/20 text-lime-400',
    contacted: 'bg-blue-500/20 text-blue-400',
    closed: 'bg-gray-500/20 text-gray-400',
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Back link */}
      <Link
        href={`/${locale}/admin/inquiries`}
        className="inline-flex w-fit items-center gap-2 text-sm text-gray-400 transition-colors hover:text-lime-400"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Inquiries
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Left column — Info */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Inquiry details card */}
          <div className="rounded-2xl border border-[#333] bg-[#111] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-xl font-bold text-white">{inquiry.name}</h1>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[status]}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <span className="text-xs font-medium uppercase tracking-wider text-gray-500">Email</span>
                <a
                  href={`mailto:${inquiry.email}`}
                  className="mt-0.5 block text-sm text-lime-400 hover:underline"
                >
                  {inquiry.email}
                </a>
              </div>

              {inquiry.company && (
                <div>
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-500">Company</span>
                  <p className="mt-0.5 text-sm text-gray-300">{inquiry.company}</p>
                </div>
              )}

              {inquiry.country && (
                <div>
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-500">Country</span>
                  <p className="mt-0.5 text-sm text-gray-300">{inquiry.country}</p>
                </div>
              )}

              {inquiry.expected_volume && (
                <div>
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-500">Expected Volume</span>
                  <p className="mt-0.5 text-sm text-gray-300">{inquiry.expected_volume}</p>
                </div>
              )}

              {inquiry.locale && (
                <div>
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-500">Locale</span>
                  <p className="mt-0.5 text-sm text-gray-300">/{inquiry.locale}</p>
                </div>
              )}

              <div>
                <span className="text-xs font-medium uppercase tracking-wider text-gray-500">Created At</span>
                <p className="mt-0.5 text-sm text-gray-300">{formatDate(inquiry.created_at)}</p>
              </div>
            </div>
          </div>

          {/* Message card */}
          <div className="rounded-2xl border border-[#333] bg-[#111] p-6">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">Message</h2>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-300">
              {inquiry.message || 'No message provided.'}
            </p>
          </div>

          {/* Status dropdown */}
          <div className="rounded-2xl border border-[#333] bg-[#111] p-6">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">Update Status</h2>
            <div className="relative">
              <select
                value={status}
                disabled={updatingStatus}
                onChange={(e) => handleStatusChange(e.target.value as Status)}
                className="w-full appearance-none rounded-lg border border-[#444] bg-[#222] px-4 py-2.5 pr-10 text-sm text-white outline-none transition-colors focus:border-lime-500 disabled:opacity-50"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="closed">Closed</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          {/* Quick actions */}
          <div className="rounded-2xl border border-[#333] bg-[#111] p-6">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">Quick Actions</h2>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleSendEmail}
                className="inline-flex items-center gap-2 rounded-lg bg-[#222] px-4 py-2.5 text-sm text-gray-300 transition-colors hover:bg-[#333] hover:text-white"
              >
                <Send className="h-4 w-4 text-purple-400" />
                Send Email
              </button>
              <button
                onClick={scrollToNoteForm}
                className="inline-flex items-center gap-2 rounded-lg bg-[#222] px-4 py-2.5 text-sm text-gray-300 transition-colors hover:bg-[#333] hover:text-white"
              >
                <StickyNote className="h-4 w-4 text-yellow-400" />
                Add Note
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 rounded-lg bg-[#222] px-4 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                {deleting ? 'Deleting...' : 'Delete Inquiry'}
              </button>
            </div>
          </div>
        </div>

        {/* Right column — Timeline */}
        <div className="flex flex-col gap-6 lg:col-span-3">
          {/* Add note form */}
          <div ref={noteFormRef} className="rounded-2xl border border-[#333] bg-[#111] p-6">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">Add Note</h2>
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Write a note about this inquiry..."
              rows={3}
              className="w-full resize-none rounded-lg border border-[#444] bg-[#222] px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-lime-500"
            />
            <div className="mt-3 flex justify-end">
              <button
                onClick={handleAddNote}
                disabled={submittingNote || !noteContent.trim()}
                className="inline-flex items-center gap-2 rounded-lg bg-lime-500 px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-lime-400 disabled:opacity-50"
              >
                <StickyNote className="h-4 w-4" />
                {submittingNote ? 'Saving...' : 'Save Note'}
              </button>
            </div>
          </div>

          {/* Activity timeline */}
          <div className="rounded-2xl border border-[#333] bg-[#111] p-6">
            <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-gray-400">Activity Timeline</h2>

            {deduped.length === 0 ? (
              <p className="text-sm text-gray-500">No activity recorded yet.</p>
            ) : (
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-4 top-0 h-full w-px bg-[#333]" />

                <div className="flex flex-col gap-6">
                  {deduped.map((entry, index) => (
                    <div key={entry.id} className="relative flex gap-4 pl-0">
                      {/* Icon */}
                      <div className="relative z-10 flex-shrink-0">
                        <TimelineIcon type={entry.type} />
                      </div>

                      {/* Content */}
                      <div className={`flex-1 pb-${index === deduped.length - 1 ? '0' : '0'}`}>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white">{typeLabel(entry.type)}</span>
                          <span className="text-xs text-gray-500">{relativeTime(entry.created_at)}</span>
                        </div>

                        {/* Status change details */}
                        {entry.type === 'status_change' && entry.metadata && (
                          <p className="mt-1 text-sm text-gray-400">
                            Status:{' '}
                            <span className="text-gray-300">{String(entry.metadata.from)}</span>
                            {' \u2192 '}
                            <span className="text-lime-400">{String(entry.metadata.to)}</span>
                          </p>
                        )}

                        {/* Note content */}
                        {entry.type === 'note_added' && entry.content && (
                          <p className="mt-1 whitespace-pre-wrap text-sm text-gray-400">{entry.content}</p>
                        )}

                        {/* Email sent details */}
                        {entry.type === 'email_sent' && !!entry.metadata?.subject && (
                          <p className="mt-1 text-sm text-gray-400">
                            Subject: <span className="text-gray-300">{String(entry.metadata.subject)}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <EmailComposer
        isOpen={isEmailOpen}
        onClose={() => setIsEmailOpen(false)}
        inquiry={{
          id: inquiry.id,
          name: inquiry.name,
          email: inquiry.email,
          company: inquiry.company,
          country: inquiry.country,
          expected_volume: inquiry.expected_volume,
        }}
        onEmailSent={handleEmailSent}
      />
    </div>
  );
}
