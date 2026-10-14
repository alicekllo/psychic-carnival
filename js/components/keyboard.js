// On-screen keyboard (one octave, C to B) mirroring the real one.
// - `target` key glows in its note colour with a bouncing marker above.
// - `played` key (feedback screens) gets a soft "you played this" ring.
// - `onKey(name)` makes keys tappable — in the prototype that simulates playing.
import { el } from './ui.js';

const WHITE = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
// Black keys sit to the right of these white-key indexes.
const BLACK = [
  { name: 'C#', after: 0 },
  { name: 'D#', after: 1 },
  { name: 'F#', after: 3 },
  { name: 'G#', after: 4 },
  { name: 'A#', after: 5 },
];

export function Keyboard({ target, targetColor, played, labels = ['C', 'D', 'E'], onKey, size = 'md' } = {}) {
  const tag = onKey ? 'button' : 'div';

  const key = (name, extra) => {
    const isTarget = name === target;
    return el(
      tag,
      {
        class: `key ${extra}${isTarget ? ' is-target' : ''}${name === played && !isTarget ? ' is-played' : ''}`,
        type: onKey ? 'button' : null,
        'aria-label': onKey ? `${name} key` : null,
        'data-note': name,
        onClick: onKey ? () => onKey(name) : null,
      },
      labels.includes(name) && el('span', { class: 'key__label' }, name),
      isTarget && el('span', { class: 'key__marker', 'aria-hidden': 'true' }, '▼'),
      name === played && !isTarget && el('span', { class: 'key__played', 'aria-hidden': 'true' }, 'you'),
    );
  };

  return el(
    'div',
    {
      class: `keyboard keyboard--${size}`,
      style: targetColor ? `--note: ${targetColor}` : null,
      role: onKey ? 'group' : 'img',
      'aria-label': target ? `Piano keyboard with ${target} highlighted` : 'Piano keyboard',
    },
    el('div', { class: 'keyboard__whites' }, WHITE.map((n) => key(n, 'key--white'))),
    BLACK.map((b) => {
      const k = key(b.name, 'key--black');
      k.style.left = `calc(${((b.after + 1) / WHITE.length) * 100}% - var(--black-w) / 2)`;
      return k;
    }),
  );
}
