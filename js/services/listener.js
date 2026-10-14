// Pitch listener — the seam where microphone pitch detection plugs in.
//
// Screens use this interface only:
//   listener.start({ onNote, onStatus, onLevel })   begin listening
//   listener.stop()                                  stop and release the mic
//   listener.simulate('D')                           prototype stand-in for a real key press
//
// onNote(event)   event = { note: 'C', octave: 4, midi: 60, frequency: 261.6, cents: -3, clarity: 0.98, source }
// onStatus(s)     s = 'starting' | 'listening' | 'error' | 'idle'
// onLevel(0..1)   loudness, for the "I can hear you" meter
//
// TODO(mic): replace `startMicrophone` with real detection, e.g. with the `pitchy` library:
//   const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//   const ctx = new AudioContext();
//   const analyser = ctx.createAnalyser(); analyser.fftSize = 2048;
//   ctx.createMediaStreamSource(stream).connect(analyser);
//   const detector = PitchDetector.forFloat32Array(analyser.fftSize);
//   const buf = new Float32Array(detector.inputLength);
//   loop with requestAnimationFrame:
//     analyser.getFloatTimeDomainData(buf);
//     const [hz, clarity] = detector.findPitch(buf, ctx.sampleRate);
//     onLevel(rms(buf));
//     if (clarity > 0.9) → feed frequencyToNote(hz) through `stable` below before onNote.
//   return a stop() that stops the stream tracks and closes the AudioContext.
import { frequencyToNote, midiToFrequency, noteToMidi } from './music.js';

async function startMicrophone(/* { emit, onLevel } */) {
  // Prototype: nothing to start. Real version returns a cleanup function.
  return () => {};
}

/**
 * Only report a note once it has been heard for a few frames in a row, so a key's
 * attack noise or a neighbouring sound doesn't get graded. Simulated input bypasses it.
 */
export function createStabilizer(framesNeeded = 4) {
  let last = null;
  let count = 0;
  return (event) => {
    if (event.midi === last) count += 1;
    else {
      last = event.midi;
      count = 1;
    }
    return count === framesNeeded ? event : null;
  };
}

export function createPitchListener() {
  let handlers = {};
  let status = 'idle';
  let stopMic = null;
  let session = 0;

  const setStatus = (s) => {
    status = s;
    handlers.onStatus?.(s);
  };

  return {
    get status() {
      return status;
    },

    async start({ onNote, onStatus, onLevel } = {}) {
      this.stop();
      const mySession = ++session;
      handlers = { onNote, onStatus, onLevel };
      setStatus('starting');
      try {
        const stop = await startMicrophone({ emit: (e) => handlers.onNote?.(e), onLevel: (l) => handlers.onLevel?.(l) });
        if (mySession !== session) return stop(); // stopped while starting
        stopMic = stop;
        setStatus('listening');
      } catch (err) {
        console.warn('Listener failed to start', err);
        if (mySession === session) setStatus('error');
      }
    },

    stop() {
      session += 1;
      stopMic?.();
      stopMic = null;
      if (status !== 'idle') setStatus('idle');
      handlers = {};
    },

    /** Pretend she pressed `note` on the real keyboard. */
    simulate(note, octave = 4) {
      if (status !== 'listening') return;
      const midi = noteToMidi(note, octave);
      handlers.onNote?.({ ...frequencyToNote(midiToFrequency(midi)), clarity: 1, source: 'simulated' });
    },
  };
}

export const listener = createPitchListener();
