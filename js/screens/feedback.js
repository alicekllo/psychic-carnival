// Feedback after a note: correct, close, or try-again. Every message is warm —
// "try again" is framed as finding the key together, never as a mistake.
import { nextNote } from '../lesson.js';
import { Character } from '../components/character.js';
import { Keyboard } from '../components/keyboard.js';
import { Button, CharacterHost, Confetti, SpeechBubble, TopBar, el, sayLines } from '../components/ui.js';
import { RESULT, grade } from '../services/grader.js';

const pick = (list) => list[Math.floor(Math.random() * list.length)];

const COPY = {
  [RESULT.CORRECT]: {
    mood: 'cheering',
    icon: '★',
    headline: (n) => pick([`Yes! That's ${n.name}!`, `You did it!`, `Wonderful ${n.name}!`]),
    lines: (n) => [pick(['Hooray!', 'Amazing!', 'Wow, great job!']), `You played ${n.name} with finger ${n.finger}!`],
  },
  [RESULT.CLOSE]: {
    mood: 'encouraging',
    icon: '✿',
    headline: () => pick(['So close!', 'Almost there!', 'Nearly!']),
    lines: (n, played, dir) => [
      `That was ${played}. ${n.name} is right next door!`,
      `Slide one step to the ${dir} and try again.`,
    ],
  },
  [RESULT.TRY_AGAIN]: {
    mood: 'encouraging',
    icon: '♥',
    headline: () => pick(['Good try!', 'Nice try!', "Let's find it together!"]),
    lines: (n) => [`Let's find ${n.name} together.`, `${n.name} lives ${n.where}.`],
  },
};

export function feedbackScreen(app) {
  const { note, result, played } = app.route;
  const copy = COPY[result] ?? COPY[RESULT.TRY_AGAIN];
  const { direction } = played ? grade(note.name, { note: played }) : { direction: null };
  const lines = copy.lines(note, played, direction);

  const isCorrect = result === RESULT.CORRECT;
  const character = Character({ mood: copy.mood, size: isCorrect ? 'lg' : 'md' });
  const bubble = SpeechBubble();
  const next = nextNote(note.name);

  const actions = isCorrect
    ? [
        next
          ? Button(`Next: ${next.name}`, { icon: '▶', size: 'xl', onClick: () => app.go(`teach/${next.name}`) })
          : Button('See my prize!', { icon: '🎁', size: 'xl', onClick: () => app.go('reward') }),
        Button('Play it again', { variant: 'secondary', icon: '↻', onClick: () => app.go(`practice/${note.name}`) }),
      ]
    : [
        Button('Try again', { icon: '↻', size: 'xl', onClick: () => app.go(`practice/${note.name}`) }),
        Button('Show me again', { variant: 'secondary', icon: '?', onClick: () => app.go(`teach/${note.name}`) }),
      ];

  const el_ = el(
    'section',
    { class: `screen screen--feedback feedback--${result}`, style: `--note: ${note.color}` },
    isCorrect && Confetti(28),
    // Count this note as learned on the trail once she gets it right.
    TopBar(app, isCorrect && !next ? { allDone: true } : { note: isCorrect ? next : note }),
    el(
      'div',
      { class: 'screen__body feedback' },
      el('h1', { class: 'feedback__headline' }, el('span', { 'aria-hidden': 'true' }, copy.icon, ' '), copy.headline(note)),
      CharacterHost(character, bubble),
      !isCorrect && Keyboard({ target: note.name, targetColor: note.color, played }),
    ),
    el('div', { class: 'screen__actions' }, actions),
  );

  return { el: el_, enter: () => sayLines(app, { character, bubble }, lines) };
}
