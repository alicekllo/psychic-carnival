// Simple right hand seen from above (palm down, as it rests on the keys),
// fingers numbered the piano way: 1 = thumb … 5 = pinky.
import { el } from './ui.js';

// x/top for each finger; the thumb is drawn separately because it angles out.
const FINGERS = [
  { n: 2, x: 62, top: 34 },
  { n: 3, x: 94, top: 20 },
  { n: 4, x: 126, top: 30 },
  { n: 5, x: 156, top: 56 },
];

export function Hand({ finger, color = 'var(--note-c)', size = 'md' } = {}) {
  const cls = (n) => `finger${n === finger ? ' is-active' : ''}`;
  const tip = (n, cx, cy) =>
    `<g class="finger__tip"><circle cx="${cx}" cy="${cy}" r="12" /><text x="${cx}" y="${cy + 6}">${n}</text></g>`;

  const fingers = FINGERS.map(
    ({ n, x, top }) => `
      <g class="${cls(n)}">
        <rect x="${x}" y="${top}" width="28" height="${120 - top}" rx="14" />
        ${tip(n, x + 14, top + 16)}
      </g>`,
  ).join('');

  const svg = `
    <svg viewBox="-10 0 210 210" aria-hidden="true">
      <g class="${cls(1)}">
        <rect x="40" y="90" width="32" height="96" rx="16" transform="rotate(-32 56 180)" />
        ${tip(1, 17, 117)}
      </g>
      ${fingers}
      <rect class="palm" x="52" y="96" width="136" height="100" rx="42" />
    </svg>`;

  return el(
    'figure',
    { class: `hand hand--${size}`, style: `--note: ${color}` },
    el('div', { class: 'hand__art', html: svg }),
    finger && el('figcaption', { class: 'hand__caption' }, `Finger ${finger}`),
  );
}
