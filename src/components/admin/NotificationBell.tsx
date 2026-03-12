'use client';

import { Bell } from 'lucide-react';

export default function NotificationBell() {
  const count = 0;

  return (
    <button
      type="button"
      className="relative rounded-lg p-2 text-gray-400 transition-colors hover:bg-[#1a1a1a] hover:text-white"
      aria-label="Notifications"
    >
      <Bell className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-lime-400 px-1 text-[10px] font-bold text-black">
          {count}
        </span>
      )}
    </button>
  );
}
