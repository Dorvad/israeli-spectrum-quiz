import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function formatScore(value) {
  if (value === null || Number.isNaN(value)) return '—';
  const rounded = Math.round(value);
  return rounded > 0 ? `+${rounded}` : `${rounded}`;
}

export function scoreToPercent(score) {
  return ((clamp(score ?? 0, -100, 100) + 100) / 200) * 100;
}
