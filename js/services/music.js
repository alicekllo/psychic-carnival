// Pure music helpers — no audio. Shared by the simulated listener today and the
// real microphone listener later (pitch detectors return a frequency in Hz).

export const PITCH_CLASSES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const A4_MIDI = 69;
const A4_FREQ = 440;

export function noteToMidi(name, octave = 4) {
  const pc = PITCH_CLASSES.indexOf(name);
  if (pc < 0) throw new Error(`Unknown note ${name}`);
  return (octave + 1) * 12 + pc;
}

export const midiToFrequency = (midi) => A4_FREQ * 2 ** ((midi - A4_MIDI) / 12);

/** Hz → { note: 'C', octave: 4, midi: 60, frequency, cents } (cents = how far off the nearest note). */
export function frequencyToNote(frequency) {
  const exact = A4_MIDI + 12 * Math.log2(frequency / A4_FREQ);
  const midi = Math.round(exact);
  return {
    note: PITCH_CLASSES[((midi % 12) + 12) % 12],
    octave: Math.floor(midi / 12) - 1,
    midi,
    frequency,
    cents: Math.round((exact - midi) * 100),
  };
}

/** Signed semitone distance between two pitch classes, wrapped to -6..+6. */
export function pitchClassDistance(fromName, toName) {
  let d = PITCH_CLASSES.indexOf(toName) - PITCH_CLASSES.indexOf(fromName);
  if (d > 6) d -= 12;
  if (d < -6) d += 12;
  return d;
}
