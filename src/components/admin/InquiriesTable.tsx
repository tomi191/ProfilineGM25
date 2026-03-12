'use client';

import { useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  ChevronDown,
  ChevronUp,
  Search,
  ArrowUpDown,
  Check,
  Trash2,
  Download,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { exportToCSV } from '@/lib/export-csv';

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

type SortField = 'created_at' | 'name' | 'company' | 'status';
type SortDirection = 'asc' | 'desc';

const filterOptions: Array<{ label: string; value: Status | 'all' }> = [
  { label: 'All', value: 'all' },
  { label: 'New', value: 'new' },
  { label: 'Contacted', value: 'contacted' },
  { label: 'Closed', value: 'closed' },
];

const PAGE_SIZE = 20;

export default function InquiriesTable({
  inquiries: initial,
  locale,
}: {
  inquiries: Inquiry[];
  locale?: string;
}) {
  const [inquiries, setInquiries] = useState<Inquiry[]>(initial);
  const [filter, setFilter] = useState<Status | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);

  // Filter + search + sort
  const processed = useMemo(() => {
    let result = filter === 'all' ? inquiries : inquiries.filter((i) => i.status === filter);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.email.toLowerCase().includes(q) ||
          (i.company && i.company.toLowerCase().includes(q))
      );
    }

    result.sort((a, b) => {
      let aVal: string;
      let bVal: string;

      switch (sortField) {
        case 'created_at':
          aVal = a.created_at;
          bVal = b.created_at;
          break;
        case 'name':
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case 'company':
          aVal = (a.company || '').toLowerCase();
          bVal = (b.company || '').toLowerCase();
          break;
        case 'status':
          aVal = a.status;
          bVal = b.status;
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [inquiries, filter, searchQuery, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(processed.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = processed.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function handleSearchChange(value: string) {
    setSearchQuery(value);
    setCurrentPage(1);
  }

  function handleFilterChange(value: Status | 'all') {
    setFilter(value);
    setCurrentPage(1);
  }

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function toggleSelectAll() {
    const pageIds = paginated.map((i) => i.id);
    const allSelected = pageIds.every((id) => selectedIds.has(id));
    if (allSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        pageIds.forEach((id) => next.delete(id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        pageIds.forEach((id) => next.add(id));
        return next;
      });
    }
  }

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

  async function handleBulkMarkContacted() {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;

    const supabase = createClient();
    const { error } = await supabase
      .from('inquiries')
      .update({ status: 'contacted' as Status })
      .in('id', ids);

    if (!error) {
      setInquiries((prev) =>
        prev.map((i) => (ids.includes(i.id) ? { ...i, status: 'contacted' as Status } : i))
      );
      setSelectedIds(new Set());
    }
  }

  function handleExportSelected() {
    const ids = Array.from(selectedIds);
    const rows = inquiries.filter((i) => ids.includes(i.id));
    if (rows.length === 0) return;

    const data = rows.map((i) => ({
      date: i.created_at,
      name: i.name,
      email: i.email,
      company: i.company ?? '',
      country: i.country ?? '',
      expected_volume: i.expected_volume ?? '',
      message: i.message ?? '',
      status: i.status,
    }));

    exportToCSV(data, `inquiries-${new Date().toISOString().slice(0, 10)}.csv`);
  }

  async function handleBulkDelete() {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${ids.length} inquiry(ies)? This action cannot be undone.`
    );
    if (!confirmed) return;

    const supabase = createClient();
    const { error } = await supabase.from('inquiries').delete().in('id', ids);

    if (!error) {
      setInquiries((prev) => prev.filter((i) => !ids.includes(i.id)));
      setSelectedIds(new Set());
    }
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

  const allPageSelected = paginated.length > 0 && paginated.every((i) => selectedIds.has(i.id));

  function SortHeader({ field, children }: { field: SortField; children: React.ReactNode }) {
    return (
      <th
        className="cursor-pointer select-none px-4 py-3 font-medium transition-colors hover:text-lime-400"
        onClick={() => handleSort(field)}
      >
        <span className="inline-flex items-center gap-1">
          {children}
          <ArrowUpDown className={`h-3 w-3 ${sortField === field ? 'text-lime-400' : 'text-gray-600'}`} />
        </span>
      </th>
    );
  }

  return (
    <div>
      {/* Search bar */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search inquiries..."
            className="w-full rounded-lg border border-[#333] bg-[#111] py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none focus:border-lime-500"
          />
        </div>
      </div>

      {/* Filter buttons */}
      <div className="mb-4 flex flex-wrap gap-2">
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleFilterChange(opt.value)}
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

      {/* Bulk actions toolbar */}
      {selectedIds.size > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-[#333] bg-[#111] px-4 py-3">
          <span className="text-sm text-gray-400">
            {selectedIds.size} selected
          </span>
          <button
            onClick={handleBulkMarkContacted}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#222] px-3 py-1.5 text-xs font-medium text-lime-400 transition-colors hover:bg-[#333]"
          >
            <Check className="h-3.5 w-3.5" />
            Mark as Contacted
          </button>
          <button
            onClick={handleExportSelected}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#222] px-3 py-1.5 text-xs font-medium text-lime-400 transition-colors hover:bg-[#333]"
          >
            <Download className="h-3.5 w-3.5" />
            Export Selected (CSV)
          </button>
          <button
            onClick={handleBulkDelete}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#222] px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-[#333]"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete Selected
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-[#333] bg-[#111]">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead>
            <tr className="border-b border-[#333] text-gray-400">
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={allPageSelected}
                  onChange={toggleSelectAll}
                  className="h-4 w-4 rounded border-[#444] bg-[#222] accent-lime-500"
                />
              </th>
              <SortHeader field="created_at">Date</SortHeader>
              <SortHeader field="name">Name</SortHeader>
              <SortHeader field="company">Company</SortHeader>
              <th className="px-4 py-3 font-medium">Country</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Volume</th>
              <SortHeader field="status">Status</SortHeader>
              <th className="w-8 px-4 py-3"></th>
            </tr>
          </thead>
          {paginated.length === 0 && (
            <tbody>
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                  No inquiries found.
                </td>
              </tr>
            </tbody>
          )}
          {paginated.map((inquiry) => {
            const isExpanded = expandedId === inquiry.id;
            const isSelected = selectedIds.has(inquiry.id);
            return (
              <tbody key={inquiry.id}>
                <tr
                  className={`cursor-pointer border-b border-[#222] transition-colors hover:bg-[#1a1a1a] ${
                    isSelected ? 'bg-lime-500/5' : ''
                  }`}
                  onClick={() => setExpandedId(isExpanded ? null : inquiry.id)}
                >
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(inquiry.id)}
                      className="h-4 w-4 rounded border-[#444] bg-[#222] accent-lime-500"
                    />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-300">
                    {formatDate(inquiry.created_at)}
                  </td>
                  <td className="px-4 py-3 text-white">
                    {locale ? (
                      <a
                        href={`/${locale}/admin/inquiries/${inquiry.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="hover:text-lime-400 hover:underline"
                      >
                        {inquiry.name}
                      </a>
                    ) : (
                      inquiry.name
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-300">{inquiry.company || '\u2014'}</td>
                  <td className="px-4 py-3 text-gray-300">{inquiry.country || '\u2014'}</td>
                  <td className="px-4 py-3 text-gray-300">
                    <a
                      href={`mailto:${inquiry.email}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-lime-400 hover:underline"
                    >
                      {inquiry.email}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-gray-300">{inquiry.expected_volume || '\u2014'}</td>
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
                    <td colSpan={9} className="px-6 py-4">
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={safePage <= 1}
            className="inline-flex items-center gap-1 rounded-lg bg-[#222] px-3 py-1.5 text-sm text-gray-300 transition-colors hover:bg-[#333] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>
          <span className="text-sm text-gray-400">
            Page {safePage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage >= totalPages}
            className="inline-flex items-center gap-1 rounded-lg bg-[#222] px-3 py-1.5 text-sm text-gray-300 transition-colors hover:bg-[#333] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
