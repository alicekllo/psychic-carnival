// App shell: a tiny hash router. Every screen is addressable, so a grown-up can
// jump straight to any state while prototyping:
//   #/welcome  #/teach/C  #/practice/C  #/feedback/C/close/D  #/reward
import { NOTES, noteByName } from './lesson.js';
import { RESULT } from './services/grader.js';
import { listener } from './services/listener.js';
import { voice } from './services/voice.js';
import { welcomeScreen } from './screens/welcome.js';
import { teachScreen } from './screens/teach.js';
import { practiceScreen } from './screens/practice.js';
import { feedbackScreen } from './screens/feedback.js';
import { rewardScreen } from './screens/reward.js';

const SCREENS = {
  welcome: welcomeScreen,
  teach: teachScreen,
  practice: practiceScreen,
  feedback: feedbackScreen,
  reward: rewardScreen,
};

function parseRoute(hash) {
  const [screen, noteName, result, played] = hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  if (!SCREENS[screen]) return { screen: 'welcome' };
  const note = noteByName(noteName) ?? NOTES[0];
  return {
    screen,
    note,
    result: Object.values(RESULT).includes(result) ? result : RESULT.TRY_AGAIN,
    played: played ? decodeURIComponent(played) : null,
  };
}

const stage = document.getElementById('stage');
let active = null;

const app = {
  voice,
  listener,
  go(path) {
    const hash = `#/${path}`;
    if (location.hash === hash) render();
    else location.hash = hash;
  },
};

function render() {
  if (active) {
    active.controller.abort();
    active.screen.leave?.();
  }
  voice.cancel();

  const route = parseRoute(location.hash);
  const controller = new AbortController();
  const screen = SCREENS[route.screen]({ ...app, route, signal: controller.signal });
  active = { screen, controller };

  stage.replaceChildren(screen.el);
  stage.focus({ preventScroll: true });
  window.scrollTo(0, 0);
  document.querySelector('.proto-menu')?.removeAttribute('open');
  screen.enter?.();
}

window.addEventListener('hashchange', render);
render();
