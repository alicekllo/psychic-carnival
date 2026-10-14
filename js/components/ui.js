import { NOTES, noteIndex } from '../lesson.js';

/** Tiny DOM helper: el('div', { class: 'x', onClick: fn }, child, 'text', …) */
export function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props ?? {})) {
    if (value == null || value === false) continue;
    if (key === 'class') node.className = value;
    else if (key === 'html') node.innerHTML = value;
    else if (key.startsWith('on') && typeof value === 'function') {
      node.addEventListener(key.slice(2).toLowerCase(), value);
    } else node.setAttribute(key, value === true ? '' : value);
  }
  node.append(...children.flat().filter((c) => c != null && c !== false));
  return node;
}

export function Button(label, { variant = 'primary', icon, onClick, size } = {}) {
  return el(
    'button',
    { class: `btn btn--${variant}${size ? ` btn--${size}` : ''}`, type: 'button', onClick },
    icon && el('span', { class: 'btn__icon', 'aria-hidden': 'true' }, icon),
    el('span', { class: 'btn__label' }, label),
  );
}

export function SpeechBubble() {
  const text = el('p', { class: 'bubble__text' });
  const node = el('div', { class: 'bubble', role: 'status', 'aria-live': 'polite' }, text);
  node.setText = (t) => {
    text.textContent = t;
    node.classList.remove('bubble--pop');
    void node.offsetWidth; // restart the pop animation
    node.classList.add('bubble--pop');
  };
  return node;
}

/** Character + speech bubble side by side. */
export function CharacterHost(character, bubble, { layout = 'row' } = {}) {
  return el('div', { class: `host host--${layout}` }, character, bubble);
}

let speechRun = 0;

/**
 * Have the character say lines one after another, showing each in the bubble.
 * A newer call (or leaving the screen) cancels an older one.
 */
export async function sayLines(app, { character, bubble }, lines) {
  const run = ++speechRun;
  for (const line of [].concat(lines)) {
    if (run !== speechRun || app.signal.aborted) return;
    bubble.setText(line);
    character.setTalking(true);
    await app.voice.say(line);
    if (run !== speechRun || app.signal.aborted) return;
    character.setTalking(false);
    await new Promise((r) => setTimeout(r, 300));
  }
}

/** Little C · D · E trail at the top showing what she's learned so far. */
export function ProgressTrail(currentName, { allDone = false } = {}) {
  const current = allDone ? NOTES.length : noteIndex(currentName);
  return el(
    'ol',
    { class: 'trail', 'aria-label': 'Notes to learn' },
    NOTES.map((n, i) =>
      el(
        'li',
        {
          class: `trail__step${i < current ? ' is-done' : ''}${i === current ? ' is-current' : ''}`,
          style: `--note: ${n.color}`,
          'aria-current': i === current ? 'step' : null,
        },
        el('span', { class: 'trail__dot' }, i < current ? '★' : n.name),
        el('span', { class: 'sr-only' }, i < current ? `${n.name}, learned` : n.name),
      ),
    ),
  );
}

export function TopBar(app, { note, allDone } = {}) {
  return el(
    'header',
    { class: 'topbar' },
    el('a', { class: 'home-btn', href: '#/welcome', 'aria-label': 'Home' }, el('span', { 'aria-hidden': 'true' }, '⌂')),
    note || allDone ? ProgressTrail(note?.name, { allDone }) : el('span'),
    el('span', { class: 'topbar__spacer' }),
  );
}

export function Confetti(count = 40) {
  const colors = ['var(--note-c)', 'var(--note-d)', 'var(--note-e)', 'var(--secondary)', 'var(--grape)'];
  return el(
    'div',
    { class: 'confetti', 'aria-hidden': 'true' },
    Array.from({ length: count }, (_, i) =>
      el('span', {
        style: [
          `left: ${Math.random() * 100}%`,
          `background: ${colors[i % colors.length]}`,
          `animation-delay: ${(Math.random() * 2.5).toFixed(2)}s`,
          `animation-duration: ${(3 + Math.random() * 2.5).toFixed(2)}s`,
          `--spin: ${Math.round(Math.random() * 720 - 360)}deg`,
          `--drift: ${Math.round(Math.random() * 120 - 60)}px`,
        ].join(';'),
      }),
    ),
  );
}
