'use strict';

import { LOG } from '../utils';

const timeElementToSeconds = e => {
  const val = e.getAttribute('data-clock');

  const firstSplit = val.split(':');

  const minutes = parseInt(firstSplit[0]);

  const secondSplit = firstSplit[1].split('.');

  const seconds = parseInt(secondSplit[0]);

  return 60*minutes + seconds;
}

class TimeObserver {

  constructor(target, gameId, playerColor, parent) {
    this.elem = target;
    this.gameId = gameId;
    this.playerColor = playerColor;
    this.parent = parent;
    this.observer = null;
    this.seconds = null;
    return this;
  }

  notifyHandlers(event) {
    this.parent && this.parent.notifyHandlers(event);
  }

  stop() {
    this.observer && this.observer.disconnect();
  }

  start() {
    LOG('starting time observer');
    this.observer = new MutationObserver((mutations, obj) => {
      const seconds = timeElementToSeconds(this.elem);
      if (seconds !== this.seconds) {
        this.seconds = seconds;
        this.notifyHandlers({
          type: 'time',
          playerColor: this.playerColor,
          seconds,
        });
      }
    })
    .observe(this.elem, {
      attributes: true,
      childList: true,
      subtree: false,
      characterData: false,
    });
  }
}

export {
  timeElementToSeconds,
  TimeObserver,
};
