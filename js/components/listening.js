// "I'm listening!" indicator: a pulsing ear plus a status line.
// setStatus() mirrors the listener's statuses; setLevel(0..1) will be fed the
// microphone loudness later so the rings grow when she plays.
import { el } from './ui.js';

const LABELS = {
  idle: 'Ready when you are',
  starting: 'Getting my ears ready…',
  listening: "I'm listening!",
  heard: 'I heard you!',
  error: "I can't hear. Ask a grown-up to check the microphone.",
};

export function ListeningIndicator() {
  const label = el('p', { class: 'listening__label' });
  const node = el(
    'div',
    { class: 'listening', role: 'status', 'aria-live': 'polite' },
    el(
      'div',
      { class: 'listening__badge', 'aria-hidden': 'true' },
      el('span', { class: 'listening__ring' }),
      el('span', { class: 'listening__ring listening__ring--2' }),
      el('span', { class: 'listening__level' }),
      el('span', { class: 'listening__icon' }, '👂'),
    ),
    label,
  );

  node.setStatus = (status) => {
    node.dataset.status = status;
    label.textContent = LABELS[status] ?? '';
  };
  node.setLevel = (level) => node.style.setProperty('--level', Math.max(0, Math.min(1, level)).toFixed(2));

  node.setStatus('idle');
  node.setLevel(0);
  return node;
}
