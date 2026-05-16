import { cn } from '@/lib/utils';

export function Progress({ value = 0, className }) {
  return (
    <div className={cn('h-2 overflow-hidden rounded-full bg-white/[0.10]', className)}>
      <div
        className="h-full rounded-full bg-gradient-to-l from-cyan-300 via-fuchsia-300 to-amber-200 transition-all duration-500"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}
