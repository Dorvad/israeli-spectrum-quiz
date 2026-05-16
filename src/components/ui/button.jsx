import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
  {
    variants: {
      variant: {
        default: 'bg-white text-slate-950 shadow-[0_12px_40px_rgba(255,255,255,0.18)] hover:scale-[1.02] hover:bg-cyan-100',
        spectral: 'bg-gradient-to-l from-cyan-300 via-fuchsia-300 to-amber-200 text-slate-950 shadow-[0_18px_50px_rgba(125,92,255,.25)] hover:scale-[1.03]',
        ghost: 'border border-white/[0.12] bg-white/[0.05] text-white hover:bg-white/[0.10] hover:border-white/[0.25]',
        danger: 'bg-red-400/[0.15] text-red-100 border border-red-300/[0.25] hover:bg-red-400/[0.25]'
      },
      size: {
        default: 'h-11 px-5',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-14 px-7 text-base'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

export function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : 'button';
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
