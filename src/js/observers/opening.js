'use strict';

import { LOG } from '../utils';

const openingElementToName = e => e.textContent.trim();

class OpeningObserver {

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
    LOG('starting opening name observer');
    this.observer = new MutationObserver((mutations, obj) => {
      const openingName = openingElementToName(this.elem);
      this.notifyHandlers({
        type: 'openingName',
        name: openingName,
      });
    })
    .observe(this.elem, {
      attributes: false,
      childList: true,
      subtree: false,
      characterData: false,
    });
  }
}

export {
  openingElementToName,
  OpeningObserver,
};
