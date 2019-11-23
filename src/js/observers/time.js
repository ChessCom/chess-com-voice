'use strict';

import { LOG } from '../utils';
import { AbstractDOMObserver } from './abstract';

const timeElementToSeconds = e => {
  const val = e.getAttribute('data-clock');
  const firstSplit = val.split(':');
  const minutes = parseInt(firstSplit[0]);
  const secondSplit = firstSplit[1].split('.');
  const seconds = parseInt(secondSplit[0]);
  return 60*minutes + seconds;
}

class TimeObserver extends AbstractDOMObserver {

  constructor(target, playerColor) {
    super(target);
    this._playerColor = playerColor;
    this._seconds = null;
    return this;
  }

  start() {
    LOG('starting time observer');
    this._observer = new MutationObserver((mutations, obj) => {
      const seconds = timeElementToSeconds(this._target);
      if (seconds !== this._seconds) {
        this._seconds = seconds;
        this._notifyHandlers({
          type: 'time',
          playerColor: this._playerColor,
          seconds,
        });
      }
    })
    .observe(this._target, {
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
