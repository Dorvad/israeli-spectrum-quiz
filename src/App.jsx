import { useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Check, Copy, Download, RotateCcw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { DimensionRail } from '@/components/DimensionRail';
import { ParticleCanvas } from '@/components/ParticleCanvas';
import { PartyMatch } from '@/components/PartyMatch';
import { QuestionCard } from '@/components/QuestionCard';
import { ResultsFlow } from '@/components/ResultsFlow';
import { RiveSigil } from '@/components/RiveSigil';
import { dimensions, issueOptions, questions } from '@/data/questions';
import { calculateResults, getResultNarrative } from '@/lib/scoring';
import { cn, formatScore } from '@/lib/utils';

import '@/index.css';

gsap.registerPlugin(useGSAP);

const initialAnswers = Object.fromEntries(questions.map((question) => [question.id, undefined]));

export default function App() {
  const appRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(initialAnswers);
  const [calibration, setCalibration] = useState({ selfPlacement: '', party: '', issue: '' });
  const [showResults, setShowResults] = useState(false);
  const [copied, setCopied] = useState(false);

  const results = useMemo(() => calculateResults(answers, calibration), [answers, calibration]);
  const progress = showResults ? 100 : started ? (step / questions.length) * 100 : 0;
  const currentQuestion = questions[step];

  useGSAP(() => {
    gsap.from('.hero-piece', { y: 28, duration: 0.72, stagger: 0.08, ease: 'power3.out' });
  }, { scope: appRef });

  const setAnswer = (value) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const next = () => {
    if (step < questions.length - 1) {
      setStep((prev) => prev + 1);
      return;
    }
    setStep(questions.length);
  };

  const back = () => {
    if (showResults) {
      setShowResults(false);
      setStep(questions.length);
      return;
    }
    setStep((prev) => Math.max(0, prev - 1));
  };

  const reset = () => {
    setStarted(false);
    setShowResults(false);
    setStep(0);
    setAnswers(initialAnswers);
    setCalibration({ selfPlacement: '', party: '', issue: '' });
    setCopied(false);
  };

  const summary = useMemo(() => {
    const dimensionText = results.dimensions
      .map((dimension) => `${dimension.label}: ${formatScore(dimension.value)} (${dimension.classification})`)
      .join('\n');
    return `מפת הספקטרום הישראלי\nתוצאה: ${results.classification}\nציון סופי: ${formatScore(results.score)}\nביטחון בתוצאה: ${results.confidence}\n\n${dimensionText}`;
  }, [results]);

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify({ answers, calibration, results }, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'israeli-spectrum-result.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main ref={appRef} className="min-h-screen overflow-hidden bg-[#070812] text-white selection:bg-cyan-200 selection:text-slate-950">
      <ParticleCanvas />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_15%,rgba(103,232,249,.15),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(240,171,252,.14),transparent_32%),radial-gradient(circle_at_50%_90%,rgba(251,191,36,.11),transparent_38%)]" />
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <TopBar progress={progress} />

        {!started && (
          <Hero onStart={() => setStarted(true)} />
        )}

        {started && !showResults && step < questions.length && (
          <section className="mx-auto grid w-full max-w-5xl flex-1 place-items-center py-8">
            <QuestionCard
              question={currentQuestion}
              index={step}
              total={questions.length}
              value={answers[currentQuestion.id]}
              onAnswer={setAnswer}
              onNext={next}
              onBack={back}
              canGoBack={step > 0}
            />
          </section>
        )}

        {started && !showResults && step >= questions.length && (
          <CalibrationPanel
            calibration={calibration}
            setCalibration={setCalibration}
            onBack={back}
            onFinish={() => setShowResults(true)}
          />
        )}

        {started && showResults && (
          <ResultsScreen
            results={results}
            narrative={getResultNarrative(results)}
            onBack={back}
            onReset={reset}
            onCopy={copySummary}
            copied={copied}
            onDownload={downloadJson}
          />
        )}
      </div>
    </main>
  );
}

function TopBar({ progress }) {
  return (
    <header className="hero-piece sticky top-0 z-30 -mx-4 border-b border-white/[0.10] bg-[#070812]/[0.70] px-4 py-4 backdrop-blur-2xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/[0.10] bg-white/[0.08] shadow-[0_0_35px_rgba(103,232,249,.15)]">
            <Sparkles className="h-5 w-5 text-cyan-200" />
          </div>
          <div>
            <p className="text-sm font-black">מפת הספקטרום הישראלי</p>
            <p className="text-xs text-slate-400">שאלון עמדות אינטראקטיבי</p>
          </div>
        </div>
        <div className="hidden min-w-56 sm:block">
          <Progress value={progress} />
        </div>
      </div>
    </header>
  );
}

function Hero({ onStart }) {
  return (
    <section className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1.05fr_.95fr] lg:py-16">
      <div className="space-y-7">
        <Badge className="hero-piece w-fit border-cyan-200/[0.20] bg-cyan-200/[0.08] text-cyan-100">לא מבחן מפלגות. מפת עמדות.</Badge>
        <div className="hero-piece space-y-5">
          <h1 className="max-w-4xl text-5xl font-black leading-[1.02] tracking-[-0.06em] sm:text-7xl lg:text-8xl">
            לראות את הפוליטיקה שלך כמרחב, לא כתווית.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-300">
            השאלון ממפה תשובות על ארבעה ממדים מרכזיים בפוליטיקה הישראלית: ביטחון וסכסוך, יהודית־דמוקרטית, מוסדות דמוקרטיים וכלכלה. בסוף מתקבלת תוצאה משוקללת לצד פרופיל מפורט שמראה מה מושך אותך לאן.
          </p>
        </div>
        <div className="hero-piece flex flex-col gap-3 sm:flex-row">
          <Button size="lg" variant="spectral" onClick={onStart}>להתחיל מיפוי</Button>
          <a href="#model" className="inline-flex h-14 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.05] px-7 text-base font-semibold text-white transition hover:bg-white/[0.10]">
            לראות את המודל
          </a>
        </div>
      </div>

      <div className="hero-piece grid gap-5">
        <Card className="relative overflow-hidden p-5">
          <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-cyan-300/[0.15] blur-3xl" />
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <RiveSigil />
            <div>
              <h2 className="text-3xl font-black leading-tight">מנוע ספקטרום</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                בחירה אחת בכל פעם. בלי שמות מפלגות, בלי מנהיגים, בלי שאלות של “האם את/ה בעד דברים טובים”. רק trade-offs אמיתיים.
              </p>
            </div>
          </div>
        </Card>
        <ModelCards />
      </div>
    </section>
  );
}

function ModelCards() {
  return (
    <div id="model" className="grid gap-3 sm:grid-cols-2">
      {Object.values(dimensions).map((dimension) => (
        <article key={dimension.id} className="rounded-[1.4rem] border border-white/[0.10] bg-white/[0.045] p-4 backdrop-blur-xl">
          <div className={cn('mb-4 h-1.5 rounded-full bg-gradient-to-l', dimension.theme)} />
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-black">{dimension.label}</h3>
            <span className="rounded-full bg-white/[0.10] px-2.5 py-1 text-xs font-black">{Math.round(dimension.weight * 100)}%</span>
          </div>
          <p className="mt-2 text-xs leading-6 text-slate-400">{dimension.description}</p>
        </article>
      ))}
    </div>
  );
}

function CalibrationPanel({ calibration, setCalibration, onBack, onFinish }) {
  return (
    <section className="mx-auto grid w-full max-w-4xl flex-1 place-items-center py-10">
      <Card className="w-full overflow-hidden">
        <CardHeader>
          <Badge className="w-fit">שאלות בקרה</Badge>
          <CardTitle className="text-4xl">עוד רגע מתקבלת המפה</CardTitle>
          <CardDescription>
            השאלות האלה לא נכנסות לציון. הן עוזרות להבין פער בין זהות פוליטית לבין עמדות בפועל.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="rounded-[1.4rem] border border-white/[0.10] bg-white/[0.04] p-4">
            <label className="font-black">איפה היית ממקם/ת את עצמך פוליטית?</label>
            <div className="mt-4 grid grid-cols-7 gap-2">
              {[1, 2, 3, 4, 5, 6, 7].map((value) => (
                <button
                  key={value}
                  onClick={() => setCalibration((prev) => ({ ...prev, selfPlacement: value }))}
                  className={cn('rounded-2xl border border-white/[0.10] bg-slate-950/[0.60] py-3 font-black transition hover:bg-white/[0.10]', calibration.selfPlacement === value && 'border-cyan-200/[0.60] bg-cyan-200/[0.12] text-cyan-100')}
                >
                  {value}
                </button>
              ))}
            </div>
            <div className="mt-2 flex justify-between text-xs font-bold text-slate-500">
              <span>שמאל</span>
              <span>מרכז</span>
              <span>ימין</span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 rounded-[1.4rem] border border-white/[0.10] bg-white/[0.04] p-4">
              <span className="font-black">מפלגה קרובה, אם יש</span>
              <input
                value={calibration.party}
                onChange={(event) => setCalibration((prev) => ({ ...prev, party: event.target.value }))}
                placeholder="אפשר להשאיר ריק"
                className="rounded-2xl border border-white/[0.10] bg-slate-950/[0.65] px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-200/[0.50]"
              />
            </label>
            <label className="grid gap-2 rounded-[1.4rem] border border-white/[0.10] bg-white/[0.04] p-4">
              <span className="font-black">הנושא הכי חשוב לך</span>
              <select
                value={calibration.issue}
                onChange={(event) => setCalibration((prev) => ({ ...prev, issue: event.target.value }))}
                className="rounded-2xl border border-white/[0.10] bg-slate-950/[0.65] px-4 py-3 text-white outline-none transition focus:border-cyan-200/[0.50]"
              >
                <option value="">בחר/י נושא</option>
                {issueOptions.map((issue) => <option key={issue} value={issue}>{issue}</option>)}
              </select>
            </label>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <Button variant="ghost" onClick={onBack}>חזרה לשאלון</Button>
            <Button variant="spectral" size="lg" onClick={onFinish}>לחשב תוצאה</Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function ResultsScreen({ results, narrative, onBack, onReset, onCopy, copied, onDownload }) {
  return (
    <section className="grid flex-1 gap-6 py-8 lg:grid-cols-[.9fr_1.1fr]">
      <div className="grid gap-6 content-start" style={{ gridAutoRows: 'max-content' }}>
        <Card className="overflow-hidden">
          <CardHeader>
            <Badge className="w-fit">תוצאה</Badge>
            <CardTitle className="text-5xl leading-tight sm:text-6xl">{results.classification}</CardTitle>
            <CardDescription className="text-base">{narrative}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-3">
              <Metric label="ציון סופי" value={formatScore(results.score)} />
              <Metric label="ביטחון בתוצאה" value={results.confidence} />
              <Metric label="לא יודע/ת" value={`${results.unknown}/${results.answered + results.unknown}`} />
            </div>
            {Math.abs(results.identityGap ?? 0) >= 40 && (
              <div className="mt-4 rounded-[1.2rem] border border-amber-200/[0.20] bg-amber-200/[0.08] p-4 text-sm leading-7 text-amber-50">
                זוהה פער בין ההזדהות העצמית לבין התשובות. זה לא אומר שהתוצאה “טועה”; זה אומר שהזהות הפוליטית והעמדות המעשיות לא יושבות בדיוק על אותו ציר.
              </div>
            )}
          </CardContent>
        </Card>

        <DimensionRail results={results} />

        <PartyMatch results={results} />

        <div className="flex flex-wrap gap-3">
          <Button variant="ghost" onClick={onBack}>עריכת שאלות בקרה</Button>
          <Button variant="ghost" onClick={onCopy}>{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? 'הועתק' : 'העתקת סיכום'}</Button>
          <Button variant="ghost" onClick={onDownload}><Download className="h-4 w-4" /> הורדת JSON</Button>
          <Button variant="danger" onClick={onReset}><RotateCcw className="h-4 w-4" /> איפוס</Button>
        </div>
      </div>

      <Card className="overflow-hidden p-4 lg:sticky lg:top-24 lg:self-start">
        <CardHeader className="px-2">
          <CardTitle>מפת־צירים חיה</CardTitle>
          <CardDescription>הגרף מציג את הציון הכללי ואת ארבעת ממדי המשנה. חיצי הגרף יוצאים מהסיכום הכללי לכל ממד.</CardDescription>
        </CardHeader>
        <ResultsFlow results={results} />
      </Card>
    </section>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-[1.25rem] border border-white/[0.10] bg-white/[0.045] p-4">
      <div className="text-xs font-bold text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-black text-white">{value}</div>
    </div>
  );
}
