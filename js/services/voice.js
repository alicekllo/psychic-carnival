// Character voice adapter.
//
// The rest of the app only ever calls `voice.say(text)` (a Promise that resolves
// when Pip finishes talking) and `voice.cancel()`. Screens show the words in a
// speech bubble and animate Pip's beak while the promise is pending.
//
// PROTOTYPE: no sound — `say` just waits roughly as long as reading the line takes.
//
// TODO(speech): wire the Web Speech API by replacing `speak` below, e.g.
//   const u = new SpeechSynthesisUtterance(text);
//   u.rate = 0.9; u.pitch = 1.3; u.voice = pickFriendlyVoice();
//   u.onend = u.onerror = resolve;
//   speechSynthesis.speak(u);
// and make `stop` call `speechSynthesis.cancel()`. Note: browsers may block speech
// until the first user tap — the Welcome screen's Start button is that tap.

function estimateMs(text) {
  return Math.max(1200, text.length * 55);
}

function speak(text, resolve) {
  const timer = setTimeout(resolve, estimateMs(text));
  return () => clearTimeout(timer); // stop()
}

let pending = null; // { stop, resolve }

export const voice = {
  say(text) {
    this.cancel();
    return new Promise((resolve) => {
      const done = () => {
        pending = null;
        resolve();
      };
      pending = { stop: speak(text, done), resolve: done };
    });
  },

  cancel() {
    if (!pending) return;
    const { stop, resolve } = pending;
    stop();
    resolve();
  },
};
