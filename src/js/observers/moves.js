'use strict';

import { LOG } from '../utils';

const moveElementToEvent = (e) => {
  return {
    type: 'move',
    san: e.textContent.trim(),
  };
}

class MovesObserver {

  constructor(target, parent) {
    this.elem = target;
    this.parent = parent;
    this.observer = null;
    return this;
  }

  notifyHandlers(event) {
    this.parent && this.parent.notifyHandlers(event);
  }

  stop() {
    this.observer && this.observer.disconnect();
  }

  start() {
    LOG('moves observing started...');
    this.observer = new MutationObserver((mutations, obj) => {
      for (let mutation of mutations) {
        if (mutation.type === 'childList') {
          for (let i = 0; i < mutation.addedNodes.length; ++i) {
            const node = mutation.addedNodes.item(i);
            const moveNodes = node.querySelectorAll('.move-text-component');
            for (const moveNode of moveNodes) {
              this.notifyHandlers(moveElementToEvent(moveNode));
            }
          }
        }
      }
    })
    .observe(this.elem, {
      attributes: false,
      childList: true,
      subtree: true,
      characterData: false,
    });
  }
}

export {
  moveElementToEvent,
  MovesObserver,
};
