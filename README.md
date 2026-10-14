# Piano Pals 🎹

A clickable prototype of a browser app that helps a young child learn their first piano notes (**C, D, E**) on a real keyboard, guided by a friendly bird called **Pip**.

No sound is wired up yet. Pip's lines show up in a speech bubble, and you "play" a note by tapping the on-screen keys or using the grown-up test buttons.

## Run it

It uses plain HTML, CSS and ES modules, with no build step and no dependencies. Modules need to be served over HTTP:

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

## The five screens

| # | Screen | Route | What happens |
|---|--------|-------|--------------|
| 1 | Welcome | `#/welcome` | Pip says hi and there's a big **Let's play!** button |
| 2 | Teach | `#/teach/C` | Pip explains the note, the key glows, and the hand shows which finger to use |
| 3 | Practice | `#/practice/C` | Shows the target note, the "I'm listening!" ear and the keyboard |
| 4 | Feedback | `#/feedback/C/correct/C` · `…/close/D` · `…/tryAgain/G` | Warm messages for each result. For *close* and *try again*, it shows where she played and which way to move |
| 5 | Reward | `#/reward` | Stars for C, D and E, plus confetti |

Every state has its own URL. The **☰** button in the bottom-right corner jumps to any screen.

**Flow:** Welcome → Teach C → Practice C → Feedback → (correct) Teach D → … → Reward. *Close* and *try again* lead back to Practice, or to Teach with "Show me again".

**Prototype input:** on the Practice screen, tap a key on the on-screen keyboard. Tapping the target key counts as correct, a neighbouring key as close, and anything further away as try again. You can also use the dashed **Grown-up test** buttons.

## Project layout

```
index.html
css/styles.css              all styling; colour tokens at the top (one colour per note)
js/main.js                  hash router + screen lifecycle (enter / leave)
js/lesson.js                the notes, fingers and everything Pip says — add F, G… here
js/services/
  voice.js                  ← Web Speech API goes here
  listener.js               ← microphone + pitch detection goes here
  music.js                  Hz ⇄ note helpers (pure)
  grader.js                 correct / close / try-again rules
js/components/              character (Pip), keyboard, hand, listening indicator, UI bits
js/screens/                 one file per screen
```

## Adding sound later

Screens never talk to audio APIs directly. Each integration fits behind a small interface that already exists.

### Character voice: `js/services/voice.js`

Screens call `await voice.say(text)` and `voice.cancel()`. Right now `say` waits for about the time it takes to read the line. To add real speech, replace the `speak()` function with `speechSynthesis` / `SpeechSynthesisUtterance`. The file has a sketch in its `TODO(speech)` comment. Pip's beak animation and the line-by-line pacing already follow the promise.

Browsers often block speech until the first tap. The Welcome screen's **Let's play!** button is that tap, so the first line you'll hear is on the Teach screen.

### Listening: `js/services/listener.js`

The Practice screen calls:

```js
listener.start({ onNote, onStatus, onLevel });
listener.stop(); // called automatically when leaving the screen
```

- `onNote({ note, octave, midi, frequency, cents, clarity })` sends the note to the grader and then to the feedback screen.
- `onStatus('starting' | 'listening' | 'error')` drives the ear indicator. The error state shows "ask a grown-up to check the microphone".
- `onLevel(0..1)` makes the ring around the ear pulse with loudness. It's already wired to the indicator.

To add the microphone, implement `startMicrophone()` with `getUserMedia` → `AudioContext` → `AnalyserNode` → a pitch detector (the `TODO(mic)` comment shows how with [pitchy](https://github.com/ianprime0509/pitchy)). Convert Hz with `frequencyToNote()`, and pass readings through `createStabilizer()` so that only a note held for a few frames gets graded. `listener.simulate()` can stay for testing.

### Grading rules: `js/services/grader.js`

Any octave counts. The exact note is **correct**, one or two semitones away is **close**, and anything else is **try again**. The result also says which direction she should move, which feeds lines like "slide one step to the left".

## Design notes

- Tap targets are at least 88px tall and the main buttons are bigger. Text is large and rounded (Baloo 2).
- Each note has its own colour (C coral, D orange, E yellow), used on the key, the badge, the finger and the progress trail.
- The feedback copy never says "wrong". It says *So close!* or *Let's find it together!*, and explains where the key lives.
- Respects `prefers-reduced-motion`. Pip and the hand are inline SVG placeholders, so you can swap in real artwork without touching the screens.
