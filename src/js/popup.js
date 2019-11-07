'use strict';

import { Settings } from './settings';

// grab UI controls from document
const volumeElem = document.getElementById('volume');
const muteElem = document.getElementById('mute');
const voiceElems = document.querySelectorAll('input[type="radio"][name="voice"]');

// initialize values for UI controls
Settings.get(['volume', 'mute', 'voice'], ({ volume, mute, voice }) => {
  volumeElem.value = volume;
  muteElem.checked = mute;
  Array.from(voiceElems).filter(e => e.value === voice)[0].checked = true;
});

// add on change listeners to controls, so changes are reflected into
// persistent settings

volumeElem.addEventListener('change', (event) => {
  const value = event.target.value;
  Settings.set({ volume: value });
});

muteElem.addEventListener('change', (event) => {
  const value = event.target.checked;
  Settings.set({ mute: value });
});

voiceElems.forEach((e) => {
  e.addEventListener('change', (event) => {
    const value = event.target.value;
    Settings.set({ voice: value });
  });
});
