import { NOTES } from '../lesson.js';
import { Character } from '../components/character.js';
import { Button, CharacterHost, Confetti, SpeechBubble, TopBar, el, sayLines } from '../components/ui.js';

export function rewardScreen(app) {
  const character = Character({ mood: 'cheering' });
  const bubble = SpeechBubble();
  const names = NOTES.map((n) => n.name);
  const list = `${names.slice(0, -1).join(', ')} and ${names.at(-1)}`;

  const el_ = el(
    'section',
    { class: 'screen screen--reward' },
    Confetti(60),
    TopBar(app, { allDone: true }),
    el(
      'div',
      { class: 'screen__body reward' },
      el('h1', { class: 'reward__headline' }, 'You learned ', list, '!'),
      el(
        'ul',
        { class: 'reward__badges', 'aria-label': 'Notes learned' },
        NOTES.map((n, i) =>
          el(
            'li',
            { class: 'badge', style: `--note: ${n.color}; --i: ${i}` },
            el('span', { class: 'badge__star', 'aria-hidden': 'true' }, '★'),
            el('span', { class: 'badge__name' }, n.name),
          ),
        ),
      ),
      CharacterHost(character, bubble),
    ),
    el(
      'div',
      { class: 'screen__actions' },
      Button('Play again', { icon: '↻', size: 'xl', onClick: () => app.go(`teach/${NOTES[0].name}`) }),
    ),
  );

  return {
    el: el_,
    enter: () =>
      sayLines(app, { character, bubble }, [`Hooray! You learned ${list}!`, "You're a real piano star!"]),
  };
}
