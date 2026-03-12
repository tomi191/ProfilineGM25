'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Inbox, Clock, RefreshCw, Check, X } from 'lucide-react';

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  inquiry_id: string | null;
  read: boolean;
  created_at: string;
}

function relativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.max(0, now - then);
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function TypeIcon({ type }: { type: string }) {
  switch (type) {
    case 'new_inquiry':
      return <Inbox className="h-4 w-4 shrink-0 text-lime-400" />;
    case 'follow_up_reminder':
      return <Clock className="h-4 w-4 shrink-0 text-yellow-400" />;
    case 'status_change':
      return <RefreshCw className="h-4 w-4 shrink-0 text-blue-400" />;
    default:
      return <Bell className="h-4 w-4 shrink-0 text-gray-400" />;
  }
}

export default function NotificationBell({ locale }: { locale: string }) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/notifications');
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(data.notifications ?? []);
      setUnreadCount(data.unreadCount ?? 0);
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  async function markAllRead() {
    try {
      await fetch('/api/admin/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ all: true }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {
      // silent
    }
  }

  function handleNotificationClick(n: Notification) {
    // Mark as read
    if (!n.read) {
      fetch('/api/admin/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [n.id] }),
      }).catch(() => {});
      setNotifications((prev) =>
        prev.map((item) => (item.id === n.id ? { ...item, read: true } : item))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    }

    if (n.inquiry_id) {
      setOpen(false);
      router.push(`/${locale}/admin/inquiries/${n.inquiry_id}`);
    }
  }

  const displayed = notifications.slice(0, 5);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        className="relative rounded-lg p-2 text-gray-400 transition-colors hover:bg-[#1a1a1a] hover:text-white"
        aria-label="Notifications"
        onClick={() => setOpen((v) => !v)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-lime-400 px-1 text-[10px] font-bold text-black">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border border-[#333] bg-[#111] shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#333] px-4 py-3">
            <span className="text-sm font-semibold text-white">Notifications</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded p-0.5 text-gray-500 hover:text-white"
              aria-label="Close notifications"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {displayed.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-gray-500">
                No notifications
              </p>
            ) : (
              displayed.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => handleNotificationClick(n)}
                  className={`flex w-full items-start gap-3 border-l-2 px-4 py-3 text-left transition-colors hover:bg-[#1a1a1a] ${
                    n.read ? 'border-l-transparent' : 'border-l-lime-400'
                  }`}
                >
                  <div className="mt-0.5">
                    <TypeIcon type={n.type} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">{n.title}</p>
                    <p className="truncate text-xs text-gray-400">{n.body}</p>
                    <p className="mt-0.5 text-[11px] text-gray-600">
                      {relativeTime(n.created_at)}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-[#333] px-4 py-2">
            <button
              type="button"
              onClick={markAllRead}
              className="flex items-center gap-1 text-xs text-gray-400 transition-colors hover:text-lime-400"
            >
              <Check className="h-3 w-3" />
              Mark all as read
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                router.push(`/${locale}/admin/settings`);
              }}
              className="text-xs text-gray-400 transition-colors hover:text-lime-400"
            >
              View all
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
