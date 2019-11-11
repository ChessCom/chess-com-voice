
'use strict';

const makeAudioPath = ({ basePath, identifierPath, extension }) => {
  return `${basePath}${identifierPath}.${extension}`;
}

class AudioSequence {
  constructor(paths, volume) {
    this.paths = paths;
    this.volume = volume;
    this.listeners = {};
  }

  _playNext() {
    if (!this.paths.length) {
      if (this.listeners['ended'] && typeof this.listeners['ended'] === 'function') {
        this.listeners['ended']();
      }
    } else {
      const audio = new Audio();
      audio.addEventListener('canplaythrough', () => {
        audio.addEventListener('ended', () => { this._playNext(); });
        audio.volume = this.volume;
        audio.play();
      });
      audio.addEventListener('error', () => { this._playNext(); });
      const path = this.paths.shift();
      audio.src = chrome.extension.getURL(path);
    }
  }
  play() {
    this._playNext();
  }

  addEventListener(type, listener) {
    this.listeners[type] = listener;
  }
};

class PlayQueue {
  constructor() {
    this.audios = [];
  }

  enqueue(audio) {
    this.audios.push(audio);
    if (this.audios.length === 1) {
      this.deque();
    }
  }

  deque() {
    if (!this.audios.length) {
      return;
    }
    const head = this.audios[0];
    head.addEventListener('ended', () => {
      this.audios.shift();
      while (this.audios.length >= 2) {
        this.audios.shift();
      }
      this.deque();
    });

    head.play();
  }

  clear() {
    this.audios = [];
  }
};

export {
  makeAudioPath,
  AudioSequence,
  PlayQueue,
};
