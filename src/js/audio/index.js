import { DefaultVoice } from './voices/default';

const voices = {};

const VoiceFactory = ({ voice, mute, volume }) => {
  if (!voices[voice]) {
    if (voice === 'default') {
      voices[voice] = new DefaultVoice({ volume, mute });
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
