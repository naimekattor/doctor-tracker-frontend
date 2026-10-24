import React from 'react';
import { cn } from '@/lib/utils/cn';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'ghost' | 'neon' | 'capsule';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
  isPill?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', isLoading = false, isPill, disabled, children, ...props }, ref) => {
    const isPillShape = isPill !== undefined ? isPill : (variant === 'primary' || variant === 'neon');

    const baseStyles =
      'h-[40px] px-5 text-[15px] font-semibold rounded-[6px] inline-flex items-center justify-center gap-2 transition-all duration-200 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E584B] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed';

    const variants: Record<ButtonVariant, string> = {
      primary:
        'bg-[#02634c] text-white font-semibold shadow-sm hover:brightness-115 hover:shadow-md hover:scale-[1.01] active:scale-[0.98] border border-[#1E584B] rounded-[6px]',
      neon:
        'bg-gradient-to-r from-[#00D084] via-[#05B978] to-[#029E65] text-[#03231A] font-bold shadow-[0_2px_12px_rgba(0,208,132,0.25)] hover:brightness-105 hover:scale-[1.01] active:scale-[0.98] border border-white/20 rounded-[6px]',
      capsule:
        'bg-[#0E1215] border border-white/10 text-white hover:border-[#00D084]/40 hover:text-[#00D084] shadow-md rounded-[6px]',
      secondary:
        'bg-transparent border border-[#E8EDEB] text-[#1C2D38] hover:bg-[#F9FBFA] hover:border-[#d0d7d4] active:bg-[#edf2f0] rounded-[6px]',
      destructive: 'bg-[#CF3B3B] text-white hover:bg-[#b02f2f] active:bg-[#962626] rounded-[6px]',
      ghost: 'bg-transparent text-[#5C768D] hover:bg-[#F9FBFA] hover:text-[#1C2D38] active:bg-[#edf2f0] rounded-[6px]',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          'rounded-[6px]',
          variants[variant],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin text-current" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
