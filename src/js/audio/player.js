'use strict';


class AudioSequence {
  constructor(paths) {
    this.audios = paths.map(path => new Audio(chrome.extension.getURL(path)));
    for (let i = 0; i+1 < this.audios.length; ++i) {
      this.audios[i].addEventListener('ended', () => {
        this.audios[i+1].play();
      }, { once: true });
      //TODO: Log error here?
      this.audios[i].addEventListener('error', (e) => {
        if (e !== null) {
          this.audios[i+1].play();
        }
      }, { once: true });
    }
  }

  play() {
    this.audios[0].play();
  }

  addEventListener(type, listener) {
    if (type === 'ended') {
      this.audios[this.audios.length-1].addEventListener('ended', listener, { once: true });
    }
  }
};

class Player {
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
    }, { once: true });

    head.play();
  }
};

export { AudioSequence, Player };
