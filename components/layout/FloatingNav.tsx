'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, Bell, Users, Stethoscope, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Doctors', href: '/doctors', icon: Calendar },
  { name: 'Patients', href: '/patients', icon: Bell },
];

export function FloatingNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Floating Segmented Navigation"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 select-none animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      {/* Button Capsule Track Container with #0C2B24 Linear Gradient */}
      <div className="flex items-center gap-2 p-1.5 rounded-[8px] bg-gradient-to-r from-[#0C2B24] via-[#133E34] to-[#0A241E] border border-[#1E5246] backdrop-blur-2xl shadow-[0_12px_45px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)]">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;

          if (isActive) {
            // Active Expanded Soothing Mint Button (6px radius)
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'h-10 px-4 rounded-[6px] inline-flex items-center justify-center gap-2 text-sm font-semibold',
                  'bg-gradient-to-r from-[#00D084] via-[#05B978] to-[#029E65] text-[#03231A]',
                  'shadow-[0_2px_12px_rgba(0,208,132,0.25)] border border-white/20',
                  'transition-all duration-300 ease-out hover:brightness-105'
                )}
              >
                <Icon className="h-4 w-4 stroke-[2.2]" />
                <span className="tracking-tight">{item.name}</span>
              </Link>
            );
          }

          // Inactive Button (6px radius)
          return (
            <Link
              key={item.name}
              href={item.href}
              title={item.name}
              className={cn(
                'w-10 h-10 rounded-[6px] inline-flex items-center justify-center',
                'bg-[#081F1A] border border-white/10 text-[#8EAAA2]',
                'hover:bg-[#0F352C] hover:text-white hover:border-[#00D084]/40 hover:scale-105',
                'active:scale-95 transition-all duration-200'
              )}
            >
              <Icon className="h-4 w-4" />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default FloatingNav;
