// File: src/components/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Target,
  Bot,
  Briefcase,
  FileText,
  Map,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

const menu = [
  { icon: <Home size={18} />, label: 'Dashboard', href: '/dashboard' },
  { icon: <Target size={18} />, label: 'Goals', href: '/goals' },
  { icon: <Bot size={18} />, label: 'AI Mock Interview', href: '/ai-mock' },
  { icon: <Briefcase size={18} />, label: 'Internships', href: '/internships' },
  { icon: <FileText size={18} />, label: 'Resume Builder', href: '/resume-builder' },
  { icon: <Map size={18} />, label: 'Career Paths', href: '/career-paths' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <aside
      className={`${
        collapsed ? 'w-20' : 'w-64'
      } min-h-screen border-r bg-white dark:bg-zinc-900 p-4 transition-all duration-300`}
    >
      {/* Toggle Collapse */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="mb-4 text-zinc-700 dark:text-white hover:text-blue-500"
      >
        {collapsed ? <Menu size={20} /> : <X size={20} />}
      </button>

      {/* App Title */}
      {!collapsed && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-zinc-800 dark:text-white">InternDeck</h2>
        </div>
      )}

      <nav className="space-y-2">
        {menu.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
              pathname === item.href
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900'
                : 'hover:bg-gray-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200'
            }`}
          >
            {item.icon}
            {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Logout button */}
      <div className="mt-8">
        <button
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
