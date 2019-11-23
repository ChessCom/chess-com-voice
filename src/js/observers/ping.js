'use strict';

import { LOG } from '../utils';
import { AbstractObserver } from './abstract';

class PingObserver extends AbstractObserver {

  constructor(frequency) {
    super();
    this._frequency = frequency;
    this._interval = null;
    return this;
  }

  stop() {
    super.stop();
    this._interval && clearInterval(this._interval);
  }

  start() {
    LOG('starting ping observer');
    this._interval = setInterval(() => {
      this._notifyHandlers({ type: 'ping' });
    }, this._frequency);
  }
}

export {
  PingObserver,
};
