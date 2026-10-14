import { CHARACTER_NAME, NOTES } from '../lesson.js';
import { Character } from '../components/character.js';
import { Button, CharacterHost, SpeechBubble, el, sayLines } from '../components/ui.js';

export function welcomeScreen(app) {
  const character = Character({ mood: 'happy', size: 'lg' });
  const bubble = SpeechBubble();

  const el_ = el(
    'section',
    { class: 'screen screen--welcome' },
    el('h1', { class: 'title' }, 'Piano ', el('span', { class: 'title__accent' }, 'Pals')),
    el('div', { class: 'screen__body' }, CharacterHost(character, bubble, { layout: 'column' })),
    el(
      'div',
      { class: 'screen__actions' },
      // This tap also unlocks audio/speech in the browser once those are wired.
      Button("Let's play!", { icon: '▶', size: 'xl', onClick: () => app.go(`teach/${NOTES[0].name}`) }),
    ),
  );

  return {
    el: el_,
    enter() {
      sayLines(app, { character, bubble }, [
        `Hi! I'm ${CHARACTER_NAME}!`,
        'Want to learn some piano notes with me?',
      ]);
    },
  };
}
