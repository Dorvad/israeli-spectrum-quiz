import { cn } from '@/lib/utils';

export function Badge({ className, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-white/[0.10] bg-white/[0.08] px-3 py-1 text-xs font-semibold text-slate-200 shadow-inner shadow-white/5',
        className
      )}
      {...props}
    />
  );
}
