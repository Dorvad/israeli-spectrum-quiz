import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowLeft, ArrowRight, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dimensions } from '@/data/questions';
import { cn } from '@/lib/utils';

gsap.registerPlugin(useGSAP);

const scaleLabels = {
  1: 'מאוד שמאלה',
  2: 'שמאלה',
  3: 'קצת שמאלה',
  4: 'אמצע',
  5: 'קצת ימינה',
  6: 'ימינה',
  7: 'מאוד ימינה',
};

export function QuestionCard({ question, index, total, value, onAnswer, onNext, onBack, canGoBack }) {
  const scope = useRef(null);
  const dimension = dimensions[question.dimension];

  useGSAP(() => {
    gsap.fromTo(
      '.question-shell',
      { y: 22, opacity: 0, rotateX: -5, filter: 'blur(12px)' },
      { y: 0, opacity: 1, rotateX: 0, filter: 'blur(0px)', duration: 0.55, ease: 'power3.out' }
    );
    gsap.fromTo(
      '.answer-dot',
      { scale: 0.84, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.35, stagger: 0.035, ease: 'back.out(2)' }
    );
  }, { scope, dependencies: [question.id], revertOnUpdate: true });

  const choose = (answer) => {
    onAnswer(answer);
    gsap.fromTo(
      '.pulse-core',
      { scale: 0.65, opacity: 0.95 },
      { scale: 1.4, opacity: 0, duration: 0.55, ease: 'power2.out' }
    );
  };

  return (
    <div ref={scope} className="question-shell perspective-1000">
      <Card className="relative overflow-hidden border-white/[0.12] bg-slate-950/[0.55]">
        <div className={cn('absolute -left-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-br blur-3xl opacity-25', dimension.theme)} />
        <div className="absolute right-0 top-0 h-px w-full bg-gradient-to-l from-transparent via-white/[0.25] to-transparent" />
        <div className="pulse-core pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/[0.20] opacity-0" />

        <CardHeader className="relative">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
            <Badge className={cn('border-white/[0.15] bg-gradient-to-l text-slate-950', dimension.theme)}>
              {dimension.label}
            </Badge>
            <span className="font-mono text-xs text-slate-400">
              {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
          </div>
          <CardTitle className="max-w-3xl text-3xl leading-tight sm:text-4xl">
            איפה את/ה נמצא/ת בין שתי העמדות?
          </CardTitle>
        </CardHeader>

        <CardContent className="relative grid gap-6">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
            <PositionPanel label="קוטב שמאלי" text={question.left} side="left" />
            <div className="hidden items-center justify-center lg:flex">
              <div className="h-full w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
            </div>
            <PositionPanel label="קוטב ימני" text={question.right} side="right" />
          </div>

          <div className="rounded-[1.7rem] border border-white/[0.10] bg-black/[0.18] p-4 sm:p-5">
            <div className="mb-4 grid grid-cols-3 text-xs font-bold text-slate-400">
              <span className="text-right">שמאל</span>
              <span className="text-center">אמצע</span>
              <span className="text-left">ימין</span>
            </div>
            <div className="relative grid grid-cols-7 gap-2">
              <div className="absolute left-0 right-0 top-1/2 -z-0 h-1 -translate-y-1/2 rounded-full bg-gradient-to-l from-red-400/60 via-white/20 to-cyan-300/60" />
              {[1, 2, 3, 4, 5, 6, 7].map((answer) => (
                <button
                  key={answer}
                  type="button"
                  onClick={() => choose(answer)}
                  className={cn(
                    'answer-dot group relative z-10 min-h-16 rounded-2xl border border-white/[0.10] bg-slate-950/[0.85] p-2 text-center shadow-[0_16px_40px_rgba(0,0,0,.25)] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-200/[0.40] hover:bg-white/[0.10]',
                    value === answer && 'border-cyan-200/[0.70] bg-cyan-200/[0.13] ring-2 ring-cyan-200/[0.30]'
                  )}
                  aria-pressed={value === answer}
                >
                  <span className="block text-lg font-black text-white">{answer}</span>
                  <span className="mt-1 hidden text-[10px] font-bold leading-3 text-slate-400 sm:block">{scaleLabels[answer]}</span>
                  {value === answer && (
                    <span className="absolute -top-1 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-cyan-200 shadow-[0_0_30px_rgba(103,232,249,.9)]" />
                  )}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => choose(null)}
              className={cn(
                'mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-white/[0.15] bg-white/[0.03] px-4 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/[0.07]',
                value === null && 'border-cyan-200/[0.50] text-cyan-100'
              )}
            >
              <HelpCircle className="h-4 w-4" />
              לא יודע/ת או לא רלוונטי לי
            </button>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button variant="ghost" onClick={onBack} disabled={!canGoBack}>
              <ArrowRight className="h-4 w-4" />
              חזרה
            </Button>
            <Button variant="spectral" size="lg" onClick={onNext} disabled={value === undefined}>
              {index + 1 === total ? 'לשאלות הבקרה' : 'המשך'}
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PositionPanel({ label, text, side }) {
  return (
    <div className={cn(
      'relative overflow-hidden rounded-[1.7rem] border border-white/[0.10] bg-white/[0.045] p-5 min-h-44',
      side === 'left' ? 'shadow-[inset_-30px_0_80px_rgba(103,232,249,.05)]' : 'shadow-[inset_30px_0_80px_rgba(248,113,113,.05)]'
    )}>
      <div className="mb-4 text-xs font-black uppercase tracking-[.24em] text-slate-500">{label}</div>
      <p className="text-lg font-bold leading-8 text-slate-100">{text}</p>
    </div>
  );
}
