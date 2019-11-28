'use strict';

import { AudioSequence, PlayQueue, makeAudioPath } from '../utils';
import { LOG } from '../../utils';

class AbstractVoice {
  constructor({ volume, mute }) {
    if (new.target === AbstractVoice) {
      throw new TypeError("Cannot construct AbstractVoice instances directly");
    }
    this._volume = volume;
    this._mute = mute;
    this._q = new PlayQueue();
  }

  set mute(value) {
    this._mute = value;
    if (this._mute) {
      this._q.clear();
    }
  }

  set volume(value) {
    this._volume = value;
  }

  _playIds(ids, basePath, extension, priority = 5) {
    if (this._mute) {
      return;
    }
    const audios = ids.map(id => makeAudioPath({ basePath, identifierPath: id, extension }));
    const seq = new AudioSequence(audios, this._volume);
    this._q.enqueue(seq, priority);
  }

  start() {
    LOG('start sound not implemented');
  }

  move({ san }) {
    LOG('move sound not implemented');
  }

  idle({ playerColor, time }) {
    LOG('idle sound not implemented');
  }

  time({ playeColor, time }) {
    LOG('time sound not implemented');
  }

  win({ winnerColor, reason }) {
    LOG('win sound not implemented');
  }

  draw({ reason }) {
    LOG('draw sound not implemented');
  }

  opening({ name }) {
    LOG('opening sound not implemented');
  }

  drawOffered({ playerColor, playerUsername }) {
    LOG('draw offered sound not implemented');
  }

  drawDeclined({ playerColor, playerUsername }) {
    LOG('draw declined sound not implemented');
  }
};

export {
  AbstractVoice,
};
