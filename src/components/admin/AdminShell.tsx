'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { LogOut, LayoutDashboard } from 'lucide-react';

export default function AdminShell({
  locale,
  children,
}: {
  locale: string;
  children: React.ReactNode;
}) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(`/${locale}/admin/login`);
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-[#222] bg-[#050505]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="h-5 w-5 text-lime-400" />
            <span className="text-sm font-semibold text-white">
              Profiline GM25 <span className="text-gray-500">/ Admin</span>
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg bg-[#222] px-3 py-1.5 text-sm text-gray-300 transition-colors hover:bg-[#333] hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
