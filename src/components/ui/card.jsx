import * as React from 'react';
import { cn } from '@/lib/utils';

export function Card({ className, ...props }) {
  return (
    <section
      className={cn(
        'rounded-[2rem] border border-white/[0.10] bg-white/[0.055] text-white shadow-[0_30px_100px_rgba(0,0,0,.32)] backdrop-blur-2xl',
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return <div className={cn('space-y-2 p-6 pb-3', className)} {...props} />;
}

export function CardTitle({ className, ...props }) {
  return <h2 className={cn('text-2xl font-black tracking-tight', className)} {...props} />;
}

export function CardDescription({ className, ...props }) {
  return <p className={cn('text-sm leading-7 text-slate-300', className)} {...props} />;
}

export function CardContent({ className, ...props }) {
  return <div className={cn('p-6 pt-3', className)} {...props} />;
}
