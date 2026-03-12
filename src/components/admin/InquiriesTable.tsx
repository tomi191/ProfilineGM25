'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ChevronDown, ChevronUp } from 'lucide-react';

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

const filterOptions: Array<{ label: string; value: Status | 'all' }> = [
  { label: 'All', value: 'all' },
  { label: 'New', value: 'new' },
  { label: 'Contacted', value: 'contacted' },
  { label: 'Closed', value: 'closed' },
];

export default function InquiriesTable({ inquiries: initial }: { inquiries: Inquiry[] }) {
  const [inquiries, setInquiries] = useState<Inquiry[]>(initial);
  const [filter, setFilter] = useState<Status | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filtered = filter === 'all' ? inquiries : inquiries.filter((i) => i.status === filter);

  async function handleStatusChange(id: string, newStatus: Status) {
    setUpdatingId(id);
    const supabase = createClient();
    const { error } = await supabase.from('inquiries').update({ status: newStatus }).eq('id', id);

    if (!error) {
      setInquiries((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
      );
    }
    setUpdatingId(null);
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

  return (
    <div>
      {/* Filter buttons */}
      <div className="mb-4 flex flex-wrap gap-2">
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
              filter === opt.value
                ? 'bg-lime-500 text-black'
                : 'bg-[#222] text-gray-300 hover:bg-[#333]'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-[#333] bg-[#111]">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead>
            <tr className="border-b border-[#333] text-gray-400">
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Country</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Volume</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="w-8 px-4 py-3"></th>
            </tr>
          </thead>
          {filtered.length === 0 && (
            <tbody>
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                  No inquiries found.
                </td>
              </tr>
            </tbody>
          )}
          {filtered.map((inquiry) => {
            const isExpanded = expandedId === inquiry.id;
            return (
              <tbody key={inquiry.id}>
                <tr
                    className="cursor-pointer border-b border-[#222] transition-colors hover:bg-[#1a1a1a]"
                    onClick={() => setExpandedId(isExpanded ? null : inquiry.id)}
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-gray-300">
                      {formatDate(inquiry.created_at)}
                    </td>
                    <td className="px-4 py-3 text-white">{inquiry.name}</td>
                    <td className="px-4 py-3 text-gray-300">{inquiry.company || '—'}</td>
                    <td className="px-4 py-3 text-gray-300">{inquiry.country || '—'}</td>
                    <td className="px-4 py-3 text-gray-300">
                      <a
                        href={`mailto:${inquiry.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-lime-400 hover:underline"
                      >
                        {inquiry.email}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-gray-300">{inquiry.expected_volume || '—'}</td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={inquiry.status}
                        disabled={updatingId === inquiry.id}
                        onChange={(e) => handleStatusChange(inquiry.id, e.target.value as Status)}
                        className="rounded-lg border border-[#444] bg-[#222] px-2 py-1 text-xs text-white outline-none focus:border-lime-500"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr className="border-b border-[#222] bg-[#0a0a0a]">
                      <td colSpan={8} className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                            Message
                          </span>
                          <p className="whitespace-pre-wrap text-sm text-gray-300">
                            {inquiry.message || 'No message provided.'}
                          </p>
                          {inquiry.locale && (
                            <span className="mt-2 text-xs text-gray-500">
                              Submitted from: /{inquiry.locale}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
              </tbody>
            );
          })}
        </table>
      </div>
    </div>
  );
}
