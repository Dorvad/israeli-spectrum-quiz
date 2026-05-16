import { useEffect, useRef } from 'react';

export function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let animationFrame = 0;
    const particles = Array.from({ length: 82 }, (_, index) => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.00045,
      vy: (Math.random() - 0.5) * 0.00045,
      phase: Math.random() * Math.PI * 2,
      hue: index % 3,
    }));

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const palette = ['rgba(103,232,249,.72)', 'rgba(240,171,252,.62)', 'rgba(253,224,71,.55)'];

    const draw = (time) => {
      ctx.clearRect(0, 0, width, height);
      const t = time * 0.0002;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -0.05) p.x = 1.05;
        if (p.x > 1.05) p.x = -0.05;
        if (p.y < -0.05) p.y = 1.05;
        if (p.y > 1.05) p.y = -0.05;
      });

      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const a = particles[i];
          const b = particles[j];
          const ax = a.x * width;
          const ay = a.y * height;
          const bx = b.x * width;
          const by = b.y * height;
          const dx = ax - bx;
          const dy = ay - by;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 145) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(148,163,184,${(1 - distance / 145) * 0.12})`;
            ctx.lineWidth = 1;
            ctx.moveTo(ax, ay);
            ctx.lineTo(bx, by);
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        const x = p.x * width;
        const y = p.y * height;
        const pulse = Math.sin(t + p.phase) * 0.6 + 1.4;
        ctx.beginPath();
        ctx.fillStyle = palette[p.hue];
        ctx.shadowColor = palette[p.hue];
        ctx.shadowBlur = 18;
        ctx.arc(x, y, p.r * pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrame = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    animationFrame = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="fixed inset-0 -z-20 opacity-80" />;
}
