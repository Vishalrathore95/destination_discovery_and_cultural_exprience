// Note: This file runs via setupFiles (before test framework), so jest globals
// are not yet available here. Browser API polyfills only.
import '@testing-library/jest-dom';

// Polyfill SpeechSynthesis for jsdom environment
if (typeof window !== 'undefined' && !window.speechSynthesis) {
  window.speechSynthesis = {
    speak: () => {},
    cancel: () => {},
    getVoices: () => [],
    pause: () => {},
    resume: () => {},
    pending: false,
    speaking: false,
    paused: false,
  };
}

// Polyfill matchMedia (not available in jsdom)
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}
