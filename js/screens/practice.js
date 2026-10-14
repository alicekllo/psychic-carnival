import { NOTES } from '../lesson.js';
import { Character } from '../components/character.js';
import { Keyboard } from '../components/keyboard.js';
import { ListeningIndicator } from '../components/listening.js';
import { Button, CharacterHost, SpeechBubble, TopBar, el, sayLines } from '../components/ui.js';
import { grade } from '../services/grader.js';

export function practiceScreen(app) {
  const { note } = app.route;
  const character = Character({ mood: 'listening' });
  const bubble = SpeechBubble();
  const indicator = ListeningIndicator();
  let handled = false;

  function onNote(detected) {
    if (handled) return;
    handled = true;
    const { result } = grade(note.name, detected);
    indicator.setStatus('heard');
    // A short beat so "I heard you!" registers before the feedback screen.
    setTimeout(() => {
      if (!app.signal.aborted) app.go(`feedback/${note.name}/${result}/${detected.note}`);
    }, 600);
  }

  // Prototype: tapping the on-screen keys stands in for playing the real keyboard.
  const simulate = (name) => app.listener.simulate(name);

  // Grown-up test buttons: one per feedback state.
  const idx = NOTES.indexOf(note);
  const closeNote = (NOTES[idx + 1] ?? NOTES[idx - 1]).name;
  const farNote = 'A';

  const el_ = el(
    'section',
    { class: 'screen screen--practice', style: `--note: ${note.color}` },
    TopBar(app, { note }),
    el(
      'div',
      { class: 'screen__body practice' },
      el(
        'div',
        { class: 'practice__prompt' },
        el('p', { class: 'practice__ask' }, 'Play'),
        el('div', { class: 'note-badge note-badge--xl' }, note.name),
        el('p', { class: 'practice__finger' }, `with finger ${note.finger}`),
      ),
      CharacterHost(character, bubble, { layout: 'column' }),
      indicator,
      Keyboard({ target: note.name, targetColor: note.color, onKey: simulate }),
    ),
    el(
      'div',
      { class: 'screen__actions' },
      Button('Show me again', { variant: 'secondary', icon: '?', onClick: () => app.go(`teach/${note.name}`) }),
    ),
    el(
      'aside',
      { class: 'proto-sim', 'aria-label': 'Prototype test buttons' },
      el('span', { class: 'proto-sim__label' }, 'Grown-up test:'),
      Button('Correct', { variant: 'ghost', onClick: () => simulate(note.name) }),
      Button('Close', { variant: 'ghost', onClick: () => simulate(closeNote) }),
      Button('Try again', { variant: 'ghost', onClick: () => simulate(farNote) }),
    ),
  );

  return {
    el: el_,
    enter() {
      sayLines(app, { character, bubble }, `Your turn! Play ${note.name}.`);
      app.listener.start({
        onNote,
        onStatus: (s) => !handled && indicator.setStatus(s),
        onLevel: indicator.setLevel,
      });
    },
    leave() {
      app.listener.stop();
    },
  };
}
