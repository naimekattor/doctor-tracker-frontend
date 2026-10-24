'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { cn } from '@/lib/utils/cn';
import {
  LayoutDashboard,
  Stethoscope,
  Users,
  LogOut,
  Search,
  ChevronLeft,
  X,
  Loader2,
  Building,
  ArrowRight,
} from 'lucide-react';
import { getDoctors } from '@/lib/api/doctors';
import { getPatients } from '@/lib/api/patients';
import { Doctor } from '@/types/doctor';
import { Patient } from '@/types/patient';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  // Desktop Collapse State
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Global Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [doctorResults, setDoctorResults] = useState<Doctor[]>([]);
  const [patientResults, setPatientResults] = useState<Patient[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Navigation Items
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Doctors', href: '/doctors', icon: Stethoscope },
    { name: 'Patients', href: '/patients', icon: Users },
  ];

  // Active Navigation Pill Sliding Animation
  const navContainerRef = useRef<HTMLDivElement>(null);
  const navItemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [activePill, setActivePill] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    opacity: 0,
  });
  const [hasMounted, setHasMounted] = useState(false);

  const updateActivePill = (targetIndex?: number) => {
    let index = targetIndex;
    if (index === undefined) {
      index = navigation.findIndex(
        (item) =>
          pathname === item.href ||
          (item.href !== '/dashboard' && pathname.startsWith(item.href))
      );
    }

    if (index !== -1 && navItemRefs.current[index]) {
      const el = navItemRefs.current[index];
      if (el) {
        setActivePill({
          top: el.offsetTop,
          left: el.offsetLeft,
          width: el.offsetWidth,
          height: el.offsetHeight,
          opacity: 1,
        });
      }
    } else {
      setActivePill((prev) => ({ ...prev, opacity: 0 }));
    }
  };

  useEffect(() => {
    updateActivePill();
    const timer = setTimeout(() => {
      setHasMounted(true);
      updateActivePill();
    }, 40);

    const handleResize = () => updateActivePill();
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [pathname, isCollapsed]);

  // Debounced Global Search across Doctors & Patients
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (trimmed.length < 2) {
      setDoctorResults([]);
      setPatientResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setIsSearchOpen(true);

    const timer = setTimeout(async () => {
      try {
        const [docsRes, patsRes] = await Promise.all([
          getDoctors({ search: trimmed, limit: 4 }),
          getPatients({ search: trimmed, limit: 4 }),
        ]);
        setDoctorResults(docsRes?.data || []);
        setPatientResults(patsRes?.data || []);
      } catch (err) {
        console.error('Global search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close search popover on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    setIsSearchOpen(false);
    router.push(`/doctors?search=${encodeURIComponent(trimmed)}`);
  };

  const handleSelectResult = (url: string) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    router.push(url);
    if (onClose) onClose();
  };

  const hasResults = doctorResults.length > 0 || patientResults.length > 0;
  const isQueryActive = searchQuery.trim().length >= 2;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#0C2B24]/70 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'relative fixed inset-y-0 left-0 z-50 flex-col bg-[#0C2B24] text-white transition-[width] duration-300 ease-in-out lg:static lg:flex lg:translate-x-0 select-none border-r border-[#153D34]',
          isCollapsed ? 'lg:w-[76px]' : 'lg:w-64',
          isOpen ? 'w-64 flex translate-x-0' : 'hidden lg:flex -translate-x-full'
        )}
      >
        {/* Floating Border Collapse Toggle (Desktop only) */}
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-3.5 top-5 z-40 w-7 h-7 rounded-full bg-[#0C2B24] border border-[#1E5246] text-[#7F9E96] hover:text-[#00D084] hover:border-[#00D084]/60 hover:scale-110 active:scale-95 items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.45)] transition-all cursor-pointer"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft
            className={cn(
              'h-3.5 w-3.5 transition-transform duration-200',
              isCollapsed && 'rotate-180 text-[#00D084]'
            )}
          />
        </button>

        {/* Brand Header */}
        <div
          className={cn(
            'flex h-16 items-center border-b border-[#153D34] transition-all',
            isCollapsed
              ? 'justify-center px-0'
              : 'justify-between px-5'
          )}
        >
          <Link
            href="/dashboard"
            className={cn(
              'inline-flex items-center gap-2.5 group',
              isCollapsed && 'justify-center'
            )}
            title="Doctor Tracker"
          >
            {/* Mint Emblem */}
            <div className="relative w-8 h-8 rounded-[6px] bg-[#00D084] p-1 flex items-center justify-center shadow-md shadow-[#00D084]/20 transition-transform group-hover:scale-105 shrink-0">
              <Image
                src="/logo.png"
                alt="Doctor Tracker Logo"
                width={24}
                height={24}
                className="w-full h-full object-contain filter brightness-0"
                priority
              />
            </div>

            {/* Brand Title (Hidden when collapsed) */}
            {!isCollapsed && (
              <div className="flex items-center tracking-tight animate-in fade-in duration-200">
                <span className="text-[17px] font-bold text-white tracking-wide">
                  Doctor Tracker
                </span>
              </div>
            )}
          </Link>

          {/* Mobile Close Button only */}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-[6px] text-[#7F9E96] hover:text-white hover:bg-white/10"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Global Search Bar */}
        <div ref={searchContainerRef} className="relative px-3 pt-4 pb-2">
          {isCollapsed ? (
            /* Collapsed Search Icon Trigger */
            <button
              type="button"
              onClick={() => {
                setIsCollapsed(false);
                setTimeout(() => searchInputRef.current?.focus(), 150);
              }}
              title="Global Search"
              className="w-11 h-10 mx-auto rounded-[6px] bg-[#133A31] hover:bg-[#1a4a3f] border border-white/10 flex items-center justify-center text-[#7F9E96] hover:text-white transition-all cursor-pointer"
            >
              <Search className="h-4 w-4" />
            </button>
          ) : (
            /* Expanded Full Search Input */
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative flex items-center bg-[#133A31] border border-white/10 rounded-[6px] px-3 py-2 text-xs text-white placeholder-gray-400 focus-within:border-[#00D084] transition-all">
                {isSearching ? (
                  <Loader2 className="h-3.5 w-3.5 text-[#00D084] animate-spin mr-2 shrink-0" />
                ) : (
                  <Search className="h-3.5 w-3.5 text-[#7F9E96] mr-2 shrink-0" />
                )}
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Global search (Doctors, Patients)..."
                  value={searchQuery}
                  onFocus={() => {
                    if (searchQuery.trim().length >= 2) setIsSearchOpen(true);
                  }}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs text-white placeholder-[#7F9E96] w-full min-w-0"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setIsSearchOpen(false);
                      searchInputRef.current?.focus();
                    }}
                    className="p-0.5 text-[#7F9E96] hover:text-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Floating Global Search Results Dropdown */}
              {isSearchOpen && isQueryActive && (
                <div className="absolute left-0 top-full mt-2 w-80 max-h-[420px] overflow-y-auto rounded-[10px] bg-[#0A241E] border border-[#1E5246] shadow-[0_16px_40px_rgba(0,0,0,0.6)] z-50 p-2 space-y-3 animate-in fade-in zoom-in-95 duration-150">
                  {/* Doctors Group */}
                  <div>
                    <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#00D084] flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Stethoscope className="h-3 w-3" />
                        Doctors ({doctorResults.length})
                      </span>
                      {doctorResults.length > 0 && (
                        <button
                          type="button"
                          onClick={() => handleSelectResult(`/doctors?search=${encodeURIComponent(searchQuery)}`)}
                          className="text-[10px] text-gray-400 hover:text-white underline cursor-pointer"
                        >
                          View all
                        </button>
                      )}
                    </div>
                    {doctorResults.length === 0 ? (
                      <p className="px-2.5 py-1.5 text-[11px] text-gray-400 italic">
                        {isSearching ? 'Searching doctors...' : 'No doctors matching query'}
                      </p>
                    ) : (
                      <div className="space-y-0.5 mt-1">
                        {doctorResults.map((doc) => (
                          <button
                            key={doc._id}
                            type="button"
                            onClick={() => handleSelectResult(`/doctors/${doc._id}`)}
                            className="w-full text-left px-2.5 py-2 rounded-[6px] hover:bg-[#133A31] transition-colors flex items-center justify-between group cursor-pointer"
                          >
                            <div className="min-w-0 flex-1 pr-2">
                              <p className="text-xs font-semibold text-white truncate group-hover:text-[#00D084] transition-colors">
                                {doc.name}
                              </p>
                              <p className="text-[10px] text-[#7F9E96] truncate mt-0.5">
                                {doc.specialization} • {doc.hospital}
                              </p>
                            </div>
                            <ArrowRight className="h-3 w-3 text-gray-500 group-hover:text-white transition-transform group-hover:translate-x-0.5 shrink-0" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Patients Group */}
                  <div className="pt-2 border-t border-white/5">
                    <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#00D084] flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Users className="h-3 w-3" />
                        Patients ({patientResults.length})
                      </span>
                      {patientResults.length > 0 && (
                        <button
                          type="button"
                          onClick={() => handleSelectResult(`/patients?search=${encodeURIComponent(searchQuery)}`)}
                          className="text-[10px] text-gray-400 hover:text-white underline cursor-pointer"
                        >
                          View all
                        </button>
                      )}
                    </div>
                    {patientResults.length === 0 ? (
                      <p className="px-2.5 py-1.5 text-[11px] text-gray-400 italic">
                        {isSearching ? 'Searching patients...' : 'No patients matching query'}
                      </p>
                    ) : (
                      <div className="space-y-0.5 mt-1">
                        {patientResults.map((patient) => {
                          const docName =
                            typeof patient.doctor === 'object' && patient.doctor?.name
                              ? patient.doctor.name
                              : 'Assigned Physician';
                          return (
                            <button
                              key={patient._id}
                              type="button"
                              onClick={() => handleSelectResult(`/patients/${patient._id}`)}
                              className="w-full text-left px-2.5 py-2 rounded-[6px] hover:bg-[#133A31] transition-colors flex items-center justify-between group cursor-pointer"
                            >
                              <div className="min-w-0 flex-1 pr-2">
                                <p className="text-xs font-semibold text-white truncate group-hover:text-[#00D084] transition-colors">
                                  {patient.name}
                                </p>
                                <p className="text-[10px] text-[#7F9E96] truncate mt-0.5">
                                  {patient.condition} • Dr. {docName}
                                </p>
                              </div>
                              <ArrowRight className="h-3 w-3 text-gray-500 group-hover:text-white transition-transform group-hover:translate-x-0.5 shrink-0" />
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Footer hint */}
                  <div className="pt-2 border-t border-white/5 px-2.5 text-[10px] text-gray-400 flex items-center justify-between">
                    <span>Press Enter to search in directory</span>
                    <span className="text-[#00D084] font-semibold">Live API</span>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-2.5 py-3">
          {!isCollapsed && (
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#6B8B82]">
              Main Menu
            </div>
          )}

          {/* Navigation Track with Sliding Pill */}
          <div ref={navContainerRef} className="relative space-y-1">
            {/* Sliding Active Background Pill */}
            {activePill.opacity > 0 && (
              <div
                aria-hidden="true"
                className={cn(
                  'absolute rounded-[6px] bg-[#154C3F] border border-[#24705E] shadow-sm pointer-events-none z-0',
                  hasMounted
                    ? 'transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)]'
                    : 'transition-none'
                )}
                style={{
                  top: activePill.top,
                  left: activePill.left,
                  width: activePill.width,
                  height: activePill.height,
                }}
              />
            )}

            {navigation.map((item, index) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/dashboard' && pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  ref={(el) => {
                    navItemRefs.current[index] = el;
                  }}
                  href={item.href}
                  onClick={() => {
                    updateActivePill(index);
                    if (onClose) onClose();
                  }}
                  title={isCollapsed ? item.name : undefined}
                  className={cn(
                    'group relative z-10 flex items-center rounded-[6px] text-xs transition-colors duration-200 bg-transparent',
                    isCollapsed
                      ? 'justify-center h-10 w-10 mx-auto'
                      : 'justify-between px-3.5 py-2.5',
                    isActive
                      ? 'text-white font-semibold'
                      : 'text-[#8EAAA2] hover:bg-[#113A31]/50 hover:text-white'
                  )}
                >
                  <div
                    className={cn(
                      'flex items-center',
                      isCollapsed ? 'justify-center' : 'gap-2.5'
                    )}
                  >
                    <Icon
                      className={cn(
                        'shrink-0 transition-colors',
                        isCollapsed ? 'h-5 w-5' : 'h-4 w-4',
                        isActive
                          ? 'text-[#00D084] stroke-[2.2]'
                          : 'text-[#7F9E96] group-hover:text-white'
                      )}
                    />
                    {!isCollapsed && (
                      <span
                        className={cn(
                          isActive
                            ? 'font-semibold tracking-tight text-white'
                            : 'font-medium'
                        )}
                      >
                        {item.name}
                      </span>
                    )}
                  </div>
                  {!isCollapsed && isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00D084] shadow-[0_0_8px_rgba(0,208,132,0.8)] transition-all duration-200" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* User Profile & Sign Out at bottom */}
        <div className="p-3 border-t border-[#153D34] bg-[#0A241E]">
          {isCollapsed ? (
            /* Collapsed Single Avatar Badge with Signout tooltip */
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={logout}
                title={`${user?.email || 'User'} (Click to Sign Out)`}
                className="relative w-10 h-10 rounded-full bg-[#00D084]/20 border border-[#00D084]/40 flex items-center justify-center hover:border-rose-400 group transition-colors cursor-pointer"
              >
                <span className="text-xs font-bold text-[#00D084] group-hover:hidden">
                  {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
                </span>
                <LogOut className="h-4 w-4 text-rose-400 hidden group-hover:block transition-all" />
              </button>
            </div>
          ) : (
            /* Expanded Full Profile Pill */
            <div className="flex items-center justify-between p-2 rounded-[6px] bg-[#11372E] border border-white/5">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative w-8 h-8 rounded-full overflow-hidden bg-[#00D084]/20 border border-[#00D084]/40 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-[#00D084]">
                    {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-white truncate leading-tight">
                    {user?.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-[10px] text-[#7F9E96] truncate leading-tight mt-0.5">
                    {user?.role === 'admin' ? 'Administrator' : 'Medical Staff'}
                  </p>
                </div>
              </div>

              <button
                onClick={logout}
                title="Sign Out"
                className="p-1.5 rounded-[6px] text-[#7F9E96] hover:text-[#FF6B6B] hover:bg-white/10 transition-colors cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
