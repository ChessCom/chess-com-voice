'use strict';

import { LOG } from '../utils';

class PingObserver {

  constructor(frequency, gameId, parent) {
    this.frequency = frequency;
    this.gameId = gameId;
    this.parent = parent;
    this.interval = null;
    return this;
  }

  notifyHandlers(event) {
    this.parent && this.parent.notifyHandlers(event);
  }

  stop() {
    this.interval && clearInterval(this.interval);
  }

  start() {
    LOG('starting ping observer');
    this.interval = setInterval(() => {
      this.notifyHandlers({
        type: 'ping',
        gameId: this.gameId,
      });
    }, this.frequency);
  }
}

export {
  PingObserver,
};
