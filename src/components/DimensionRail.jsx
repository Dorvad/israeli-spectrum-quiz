import { dimensions } from '@/data/questions';
import { cn, formatScore, scoreToPercent } from '@/lib/utils';

export function DimensionRail({ results }) {
  const items = results?.dimensions ?? Object.values(dimensions).map((dimension) => ({ ...dimension, value: 0, count: 0, total: 1 }));

  return (
    <div className="grid gap-3">
      {items.map((dimension) => {
        const percent = scoreToPercent(dimension.value ?? 0);
        return (
          <article key={dimension.id} className="rounded-[1.4rem] border border-white/[0.10] bg-white/[0.045] p-4 shadow-inner shadow-white/5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h3 className="font-black text-white">{dimension.label}</h3>
                <p className="mt-1 text-xs text-slate-400">משקל במודל: {Math.round(dimension.weight * 100)}%</p>
              </div>
              <div className="rounded-full bg-white/[0.10] px-3 py-1 text-sm font-black text-white">
                {formatScore(dimension.value)}
              </div>
            </div>
            <div className="relative h-4 rounded-full bg-gradient-to-l from-red-500/35 via-slate-200/20 to-cyan-400/35 p-[1px]">
              <div className="relative h-full rounded-full bg-slate-950/[0.80]">
                <div className="absolute bottom-0 top-0 right-1/2 w-px bg-white/[0.18]" />
                <div
                  className={cn('absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border border-white/50 shadow-[0_0_28px_rgba(255,255,255,.3)]', `bg-gradient-to-l ${dimension.theme}`)}
                  style={{ right: `calc(${percent}% - 10px)` }}
                />
              </div>
            </div>
            <div className="mt-2 flex justify-between text-[11px] font-bold text-slate-500">
              <span>שמאל</span>
              <span>מרכז</span>
              <span>ימין</span>
            </div>
          </article>
        );
      })}
    </div>
  );
}
