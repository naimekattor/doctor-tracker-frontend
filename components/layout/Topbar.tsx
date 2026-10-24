'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Stethoscope,
  Users,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { cn } from '@/lib/utils/cn';

const NAV_LINKS = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Doctors Directory', href: '/doctors', icon: Stethoscope },
  { name: 'Patients Directory', href: '/patients', icon: Users },
];

export function Topbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getPageTitle = () => {
    if (pathname.startsWith('/doctors/')) return 'Doctor Profile';
    if (pathname.startsWith('/doctors')) return 'Doctors Directory';
    if (pathname.startsWith('/patients/')) return 'Patient Profile';
    if (pathname.startsWith('/patients')) return 'Patients Directory';
    return 'Dashboard';
  };

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : 'U';
  const userName = user?.email ? user.email.split('@')[0] : 'User';

  // Close dropdown on outside click or escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDropdownOpen]);

  return (
    <header className="lg:hidden min-h-[72px] py-3.5 sm:py-4 px-4 sm:px-6 border-b border-[#E8ECE9] bg-white/95 backdrop-blur-md flex items-center justify-between sticky top-0 z-30 shadow-xs transition-all">
      {/* Brand & Page Context */}
      <Link href="/dashboard" className="flex items-center gap-2.5 group">
        <div className="w-9 h-9 rounded-[8px] bg-[#00D084] p-1.5 flex items-center justify-center shadow-sm shadow-[#00D084]/25 transition-transform group-hover:scale-105">
          <Image
            src="/logo.png"
            alt="Doctor Tracker Logo"
            width={24}
            height={24}
            className="w-full h-full object-contain filter brightness-0"
            priority
          />
        </div>
        <div>
          <span className="block text-[11px] font-semibold text-[#5C768D] uppercase tracking-wider leading-none">
            Doctor Tracker
          </span>
          <h1 className="text-base font-bold text-gray-900 tracking-tight leading-tight mt-0.5">
            {getPageTitle()}
          </h1>
        </div>
      </Link>

      {/* Right Controls: Active Status & Admin Dropdown */}
      <div className="flex items-center gap-2.5">
        {/* Active Pulse Pill */}
        <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E8FAF2] text-[11px] font-semibold text-[#00A86B] border border-[#00D084]/20">
          <span className="h-1.5 w-1.5 rounded-full bg-[#00D084] animate-pulse" />
          Active
        </div>

        {/* Admin Dropdown Container */}
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            aria-expanded={isDropdownOpen}
            aria-haspopup="true"
            aria-label="Admin menu"
            className={cn(
              'flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-[8px] border transition-all cursor-pointer select-none',
              isDropdownOpen
                ? 'bg-white border-[#00D084] shadow-sm ring-2 ring-[#00D084]/20'
                : 'bg-gray-50/90 hover:bg-gray-100 border-gray-200/80'
            )}
          >
            <div className="w-7 h-7 rounded-full bg-[#0C2B24] text-[#00D084] font-bold text-xs flex items-center justify-center shadow-xs">
              {userInitial}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-semibold text-gray-800 max-w-[85px] sm:max-w-[120px] truncate leading-tight">
                {userName}
              </span>
              <span className="text-[10px] text-[#00A86B] font-medium leading-none">
                {user?.role === 'admin' ? 'Admin' : 'Staff'}
              </span>
            </div>
            <ChevronDown
              className={cn(
                'h-3.5 w-3.5 text-gray-400 transition-transform duration-200 ml-0.5',
                isDropdownOpen && 'rotate-180 text-gray-700'
              )}
            />
          </button>

          {/* Dropdown Menu Modal */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 rounded-[10px] bg-white border border-[#E8ECE9] shadow-[0_12px_36px_rgba(0,0,0,0.12)] z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              {/* Header Profile Summary */}
              <div className="p-3.5 bg-gradient-to-br from-[#F7FAF9] to-white border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#0C2B24] text-[#00D084] font-bold text-sm flex items-center justify-center shadow-xs">
                    {userInitial}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-gray-900 truncate">
                      {userName}
                    </p>
                    <p className="text-[11px] text-gray-500 truncate">
                      {user?.email || 'admin@doctortracker.com'}
                    </p>
                  </div>
                </div>
                <div className="mt-2.5 flex items-center gap-1.5 text-[10px] font-semibold text-[#00A86B] bg-[#E8FAF2] px-2 py-0.5 rounded-[4px] w-fit">
                  <ShieldCheck className="h-3 w-3" />
                  <span>{user?.role === 'admin' ? 'Full Administrator Access' : 'Medical Staff Access'}</span>
                </div>
              </div>

              {/* Navigation Links Section */}
              <div className="p-1.5 space-y-0.5">
                <div className="px-2.5 pt-1.5 pb-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Navigation
                </div>
                {NAV_LINKS.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== '/dashboard' && pathname.startsWith(item.href));
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsDropdownOpen(false)}
                      className={cn(
                        'flex items-center justify-between px-3 py-2 rounded-[6px] text-xs font-medium transition-colors',
                        isActive
                          ? 'bg-[#E8FAF2] text-[#00A86B] font-semibold'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={cn(
                            'h-4 w-4',
                            isActive ? 'text-[#00A86B]' : 'text-gray-400'
                          )}
                        />
                        <span>{item.name}</span>
                      </div>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00D084]" />
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Sign Out Section */}
              <div className="p-1.5 border-t border-gray-100 bg-gray-50/50">
                <button
                  type="button"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-[6px] text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer text-left"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Topbar;
