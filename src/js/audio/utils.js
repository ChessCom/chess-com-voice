'use strict';

import { LOG } from '../utils';

const makeAudioPath = ({ basePath, identifierPath, extension }) => {
  return `${basePath}${identifierPath}.${extension}`;
}

class AudioSequence {
  constructor(paths, volume) {
    this.paths = paths;
    this.volume = volume;
    this.listeners = {};
    this.audio = null;
  }

  _playNext() {
    if (!this.paths.length) {
      if (this.listeners['ended'] && typeof this.listeners['ended'] === 'function') {
        this.listeners['ended']();
      }
    } else {
      this.audio = new Audio();
      this.audio.addEventListener('canplaythrough', () => {
        this.audio.addEventListener('ended', () => {
          chrome.runtime.sendMessage({type: 'clearPromptInteraction'})
            .catch((err) => {
              console.log("Exception while sending message 'clearPromptInteraction'", err);
            })
            .then(() => {
              this._playNext()
            });
        });
        this.audio.volume = this.volume;
        this.audio.play()
          .catch(err => {
            chrome.runtime.sendMessage({type: 'promptInteraction'})
              .catch((err) => {
                console.log("Exception while sending message 'promptInteraction'", err)
              }).then(() => {
                this._playNext();
              })
          })
      });
      this.audio.addEventListener('error', () => { this._playNext(); });
      const path = this.paths.shift();
      this.audio.src = chrome.runtime.getURL(path);
    }
  }
  play() {
    this._playNext();
  }

  pause() {
    if (this.audio !== null) {
      this.audio.pause();
    }
  }

  addEventListener(type, listener) {
    this.listeners[type] = listener;
  }
};

class PlayQueue {
  constructor() {
    this.audios = [];
  }

  enqueue(audio, priority = 5) {
    while (this.audios.length) {
      const last = this.audios[this.audios.length-1];
      if (last.priority < priority) {
        last.audio.pause();
        this.audios.pop();
      } else {
        break;
      }
    }
    this.audios.push({
      audio,
      priority,
    });
    if (this.audios.length === 1) {
      this.deque();
    }
  }

  deque() {
    if (!this.audios.length) {
      return;
    }
    const head = this.audios[0].audio;
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
