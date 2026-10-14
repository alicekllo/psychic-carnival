// Pip — a placeholder friendly bird. Swap the SVG for real artwork later; screens
// only use setMood() and setTalking().
//
// Moods: 'happy' | 'listening' | 'cheering' | 'encouraging'
import { CHARACTER_NAME } from '../lesson.js';

const SVG = `
<svg viewBox="0 0 200 200" role="img" aria-label="${CHARACTER_NAME}, a friendly little bird">
  <g class="pip">
    <g class="pip__wing pip__wing--left"><ellipse cx="42" cy="120" rx="20" ry="34" /></g>
    <g class="pip__wing pip__wing--right"><ellipse cx="158" cy="120" rx="20" ry="34" /></g>
    <g class="pip__tuft">
      <ellipse cx="90" cy="40" rx="7" ry="16" transform="rotate(-20 90 40)" />
      <ellipse cx="100" cy="36" rx="7" ry="18" />
      <ellipse cx="110" cy="40" rx="7" ry="16" transform="rotate(20 110 40)" />
    </g>
    <circle class="pip__body" cx="100" cy="112" r="68" />
    <ellipse class="pip__belly" cx="100" cy="140" rx="40" ry="34" />
    <g class="pip__eyes">
      <g class="pip__eye"><circle cx="76" cy="96" r="15" fill="#fff" /><circle class="pip__pupil" cx="79" cy="98" r="8" /><circle cx="82" cy="94" r="3" fill="#fff" /></g>
      <g class="pip__eye"><circle cx="124" cy="96" r="15" fill="#fff" /><circle class="pip__pupil" cx="121" cy="98" r="8" /><circle cx="124" cy="94" r="3" fill="#fff" /></g>
      <path class="pip__happy-eyes" d="M64 98 q12 -14 24 0 M112 98 q12 -14 24 0" />
    </g>
    <ellipse class="pip__cheek" cx="60" cy="118" rx="10" ry="6" />
    <ellipse class="pip__cheek" cx="140" cy="118" rx="10" ry="6" />
    <path class="pip__beak-lower" d="M90 118 L110 118 L100 132 Z" />
    <path class="pip__beak-upper" d="M86 110 Q100 104 114 110 L100 122 Z" />
    <g class="pip__feet"><path d="M84 178 l-6 10 M84 178 l0 11 M84 178 l6 10 M116 178 l-6 10 M116 178 l0 11 M116 178 l6 10" /></g>
  </g>
  <g class="pip__notes" aria-hidden="true">
    <text x="160" y="50">♪</text><text x="22" y="62">♫</text>
  </g>
</svg>`;

export function Character({ mood = 'happy', size = 'md' } = {}) {
  const node = document.createElement('div');
  node.className = `character character--${size}`;
  node.dataset.mood = mood;
  node.innerHTML = SVG;
  node.setMood = (m) => (node.dataset.mood = m);
  node.setTalking = (on) => node.classList.toggle('is-talking', on);
  return node;
}
