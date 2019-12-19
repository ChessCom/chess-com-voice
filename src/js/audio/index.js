import { DefaultVoice } from './voices/default';
import { DannyVoice } from './voices/danny';

const voices = {};

const VoiceFactory = ({ voice, volume }) => {
  if (!voices[voice]) {
    if (voice === 'default') {
      voices[voice] = new DefaultVoice({ volume });
    } else if (voice === 'danny') {
      voices[voice] = new DannyVoice({ volume });
    }
  }
  const obj = voices[voice];
  obj.volume = volume;
  return obj;
};

export {
  VoiceFactory,
};
