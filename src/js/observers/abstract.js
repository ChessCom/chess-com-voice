'use strict';

import { LOG } from '../utils';

class AbstractObserver {
  constructor() {
    this._parent = null;
    this._children = [];
    this._handlers = [];
    return this;
  }

  set parent(value) {
    this._parent = value;
  }

  stopChildren() {
    this._children.forEach(c => c.stop());
  }

  stop() {
    this.stopChildren();
  }

  startChildren() {
    this._children.forEach(c => c.start());
  }

  start() {
    LOG('observer start method not implemented');
  }

  addHandler(handler) {
    this._handlers.push(handler);
  }

  addChild(child) {
    child.parent = this;
    this._children.push(child);
  }

  clearChildren() {
    this._children = [];
  }

  _prepareEvent(event) {
    return event;
  }

  _notifyHandlers(event) {
    const finalEvent = this._prepareEvent(event);
    this._parent && this._parent._notifyHandlers(finalEvent);
    this._handlers.forEach(h => h(finalEvent));
  }

};

class AbstractDOMObserver extends AbstractObserver {

  constructor(target) {
    super();
    this._target = target;
    this._observer = null;
    return this;
  }

  stop() {
    super.stop();
    this._observer && this._observer.disconnect();
  }
}

export {
  AbstractObserver,
  AbstractDOMObserver,
};
