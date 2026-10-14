import { Character } from '../components/character.js';
import { Hand } from '../components/hand.js';
import { Keyboard } from '../components/keyboard.js';
import { Button, CharacterHost, SpeechBubble, TopBar, el, sayLines } from '../components/ui.js';

export function teachScreen(app) {
  const { note } = app.route;
  const character = Character({ mood: 'happy' });
  const bubble = SpeechBubble();
  const say = () => sayLines(app, { character, bubble }, note.teach);

  const el_ = el(
    'section',
    { class: 'screen screen--teach', style: `--note: ${note.color}` },
    TopBar(app, { note }),
    el(
      'div',
      { class: 'screen__body teach' },
      CharacterHost(character, bubble),
      el(
        'div',
        { class: 'teach__visuals' },
        el('div', { class: 'note-badge', 'aria-hidden': 'true' }, note.name),
        Keyboard({ target: note.name, targetColor: note.color, size: 'lg' }),
        Hand({ finger: note.finger, color: note.color }),
      ),
    ),
    el(
      'div',
      { class: 'screen__actions' },
      Button('Say it again', { variant: 'secondary', icon: '↻', onClick: say }),
      Button("I'm ready!", { icon: '▶', onClick: () => app.go(`practice/${note.name}`) }),
    ),
  );

  return { el: el_, enter: say };
}
