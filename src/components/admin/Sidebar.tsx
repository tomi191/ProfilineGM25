'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Inbox,
  BarChart3,
  FileText,
  Settings,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '' },
  { label: 'Inquiries', icon: Inbox, path: '/inquiries' },
  { label: 'Analytics', icon: BarChart3, path: '/analytics' },
  { label: 'Content', icon: FileText, path: '/content' },
  { label: 'Settings', icon: Settings, path: '/settings' },
];

export default function Sidebar({ locale }: { locale: string }) {
  const pathname = usePathname();
  const base = `/${locale}/admin`;

  return (
    <nav className="flex h-full w-60 flex-col border-r border-[#222] bg-[#0a0a0a]">
      {/* Logo */}
      <div className="flex items-center gap-2.5 border-b border-[#222] px-5 py-5">
        <LayoutDashboard className="h-5 w-5 text-lime-400" />
        <span className="text-sm font-bold tracking-tight text-white">
          Profiline <span className="text-lime-400">GM25</span>
        </span>
      </div>

      {/* Links */}
      <ul className="mt-2 flex flex-1 flex-col gap-0.5 px-3">
        {navItems.map(({ label, icon: Icon, path }) => {
          const href = `${base}${path}`;
          const isActive =
            path === ''
              ? pathname === base || pathname === `${base}/`
              : pathname.startsWith(href);

          return (
            <li key={label}>
              <Link
                href={href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-lime-500/10 text-lime-400'
                    : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-gray-200'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
