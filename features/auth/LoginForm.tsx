'use client';

import React, { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AlertCircle, Lock, Mail, Sparkles } from 'lucide-react';

export function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isColdStarting, setIsColdStarting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    let coldStartTimer: NodeJS.Timeout | null = null;
    try {
      setIsLoading(true);
      setIsColdStarting(false);
      // If request takes longer than 3.5 seconds, Render instance is likely in sleep state
      coldStartTimer = setTimeout(() => {
        setIsColdStarting(true);
      }, 3500);

      await login({ email, password });
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      if (coldStartTimer) clearTimeout(coldStartTimer);
      setIsLoading(false);
      setIsColdStarting(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@doctortracker.com');
    setPassword('AdminPassword123!');
    setErrorMessage(null);
  };

  return (
    <div className="w-full space-y-6">
      {errorMessage && (
        <div className="flex items-start gap-3 p-3.5 rounded-lg bg-[#CF3B3B]/10 border border-[#CF3B3B]/20 text-[#CF3B3B] text-sm animate-in fade-in">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <p className="leading-snug">{errorMessage}</p>
        </div>
      )}

      {isColdStarting && (
        <div className="flex items-start gap-3 p-3.5 rounded-lg bg-[#00684A]/10 border border-[#00ED64]/30 text-[#00684A] text-xs animate-in fade-in">
          <div className="h-4 w-4 shrink-0 rounded-full border-2 border-[#00ED64] border-t-transparent animate-spin mt-0.5" />
          <p className="leading-snug">
            <strong>Waking up free-tier cloud backend on Render...</strong> Please wait 15–30 seconds for the container to boot. Subsequent requests will be instant.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-[#5C768D] block mb-1.5">
            Admin Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-[#5C768D]" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@doctortracker.com"
              className="h-[40px] w-full rounded-[6px] border border-[#E8EDEB] bg-white pl-9 pr-3 text-[14px] text-[#1C2D38] placeholder:text-[#5C768D]/60 focus:border-[#02634c] focus:outline-none focus:ring-2 focus:ring-[#00D084]/20"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-[#5C768D] block mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-[#5C768D]" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="h-[40px] w-full rounded-[6px] border border-[#E8EDEB] bg-white pl-9 pr-3 text-[14px] text-[#1C2D38] placeholder:text-[#5C768D]/60 focus:border-[#02634c] focus:outline-none focus:ring-2 focus:ring-[#00D084]/20"
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          className="w-full mt-3 h-[46px] text-[15px] font-bold rounded-[6px] bg-[#02634c] text-[#ffffff] shadow-[0_2px_12px_rgba(0,208,132,0.25)] border border-[#24705e] transition-all duration-300 ease-out hover:brightness-105 active:scale-[0.99] cursor-pointer"
        >
          Sign In to Portal
        </Button>
      </form>

      {/* Quick Demo Helper — Button Container with #0C2B24 Linear Gradient & 6px Radius */}
      <div className="pt-2 border-t border-[#E8EDEB]">
        <button
          type="button"
          onClick={handleFillDemo}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-[#00D084] bg-gradient-to-r from-[#0C2B24] via-[#133E34] to-[#0A241E] hover:border-[#00D084]/50 hover:text-[#38E5A3] rounded-[6px] transition-all border border-[#1E5246] shadow-sm cursor-pointer active:scale-[0.99]"
        >
          <Sparkles className="h-3.5 w-3.5 text-[#00D084]" />
          Fill Demo Admin Credentials
        </button>
      </div>
    </div>
  );
}
