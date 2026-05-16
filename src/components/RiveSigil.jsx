import Rive from '@rive-app/react-webgl2';

export function RiveSigil() {
  return (
    <div className="relative h-36 w-36 shrink-0 overflow-hidden rounded-[2rem] border border-white/[0.10] bg-black/[0.20] shadow-[0_0_80px_rgba(103,232,249,.16)] sm:h-44 sm:w-44">
      <div className="absolute inset-3 rounded-[1.5rem] bg-[radial-gradient(circle_at_50%_50%,rgba(103,232,249,.22),transparent_58%)]" />
      <div className="absolute inset-0 opacity-80 mix-blend-screen">
        <Rive
          src="https://cdn.rive.app/animations/vehicles.riv"
          stateMachines="bumpy"
          className="h-full w-full scale-125 opacity-70 saturate-150"
        />
      </div>
      <div className="sigil-fallback absolute inset-0" aria-hidden="true" />
      <div className="absolute bottom-4 left-4 right-4 rounded-full border border-white/[0.10] bg-slate-950/[0.70] px-3 py-1 text-center text-[10px] font-bold uppercase tracking-[.28em] text-cyan-100">
        Spectrum
      </div>
    </div>
  );
}
