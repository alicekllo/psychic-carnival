// Decides how a played note compares to the target. Kept separate from the
// listener so the rules can be tuned without touching audio code.
import { pitchClassDistance } from './music.js';

export const RESULT = { CORRECT: 'correct', CLOSE: 'close', TRY_AGAIN: 'tryAgain' };

/**
 * @param {string} target  e.g. 'C'
 * @param {{ note: string }} detected  a detection event from the listener
 * @returns {{ result: string, direction: 'left'|'right'|null }}
 *   direction = which way she should move from the key she played to reach the target.
 */
export function grade(target, detected) {
  // Any octave counts — for a beginner, "a C" is a C.
  const d = pitchClassDistance(detected.note, target);
  if (d === 0) return { result: RESULT.CORRECT, direction: null };

  const direction = d > 0 ? 'right' : 'left';
  // One or two semitones away = the neighbouring key: "so close!"
  if (Math.abs(d) <= 2) return { result: RESULT.CLOSE, direction };
  return { result: RESULT.TRY_AGAIN, direction };
}
