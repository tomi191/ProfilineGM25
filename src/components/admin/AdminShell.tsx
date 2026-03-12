'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { LogOut, Menu, X, LayoutDashboard } from 'lucide-react';
import Sidebar from './Sidebar';
import NotificationBell from './NotificationBell';

export default function AdminShell({
  locale,
  children,
}: {
  locale: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(`/${locale}/admin/login`);
    router.refresh();
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#050505]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — desktop: static, mobile: overlay */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 transition-transform duration-200 lg:relative lg:z-auto lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close button on mobile */}
        <button
          type="button"
          className="absolute right-2 top-4 rounded-lg p-1 text-gray-500 hover:text-white lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
        <Sidebar locale={locale} />
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#222] bg-[#050505]/90 px-4 py-3 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <button
              type="button"
              className="rounded-lg p-1 text-gray-400 hover:text-white lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>

            <LayoutDashboard className="h-5 w-5 text-lime-400" />
            <span className="text-sm font-semibold text-white">
              Profiline GM25 <span className="text-gray-500">/ Admin</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <NotificationBell locale={locale} />
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg bg-[#222] px-3 py-1.5 text-sm text-gray-300 transition-colors hover:bg-[#333] hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}
