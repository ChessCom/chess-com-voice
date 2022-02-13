'use strict';

import { LOG } from '../utils';
import { AbstractDOMObserver } from './abstract';

const moveElementToEvent = (e) => {
  return {
    type: 'move',
    san: e.textContent.trim(),
  };
}

class MovesObserver extends AbstractDOMObserver {

  start() {
    LOG('moves observing started...');
    this._observer = new MutationObserver((mutations, obj) => {
      for (let mutation of mutations) {
        if (mutation.type === 'childList') {
          for (let i = 0; i < mutation.addedNodes.length; ++i) {
            const node = mutation.addedNodes.item(i);
            if (node.classList.contains('node')) {
              this._notifyHandlers(moveElementToEvent(node));
            }
          }
        }
      }
    })
    .observe(this._target, {
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
