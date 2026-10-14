// Lesson content: the notes she's learning and everything Pip says about them.
// Add more notes here later (F, G, …) and the screens pick them up automatically.

export const CHARACTER_NAME = 'Pip';

export const NOTES = [
  {
    name: 'C',
    octave: 4, // middle C — used as the "expected" octave, but any C counts as correct
    finger: 1,
    fingerName: 'thumb',
    color: 'var(--note-c)',
    where: 'just to the left of the two black keys',
    teach: [
      'This is C!',
      'C lives just to the left of the two black keys.',
      'Use your first finger. That is your thumb!',
    ],
  },
  {
    name: 'D',
    octave: 4,
    finger: 2,
    fingerName: 'pointer finger',
    color: 'var(--note-d)',
    where: 'in the middle of the two black keys',
    teach: [
      'This is D!',
      'D lives right in the middle of the two black keys, like a doggy in its doghouse.',
      'Use your second finger. That is your pointer finger!',
    ],
  },
  {
    name: 'E',
    octave: 4,
    finger: 3,
    fingerName: 'middle finger',
    color: 'var(--note-e)',
    where: 'just to the right of the two black keys',
    teach: [
      'This is E!',
      'E lives just to the right of the two black keys.',
      'Use your third finger. That is your middle finger!',
    ],
  },
];

export const noteByName = (name) => NOTES.find((n) => n.name === name);
export const noteIndex = (name) => NOTES.findIndex((n) => n.name === name);
export const nextNote = (name) => NOTES[noteIndex(name) + 1] ?? null;
