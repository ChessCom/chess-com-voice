import { DefaultVoice } from './voices/default';
import { DannyVoice } from './voices/danny';

const voices = {};

const VoiceFactory = ({ voice, mute, volume }) => {
  if (!voices[voice]) {
    if (voice === 'default') {
      voices[voice] = new DefaultVoice({ volume, mute });
    } else if (voice === 'danny') {
      voices[voice] = new DannyVoice({ volume, mute });
    }
  }
  const obj = voices[voice];
  obj.setMute(mute);
  obj.setVolume(volume);
  return obj;
};

export {
  VoiceFactory,
};
