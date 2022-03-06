'use strict';

import { LOG } from '../utils';
import { AbstractDOMObserver } from './abstract';

const openingElementToName = e => e.textContent.trim();

class OpeningObserver extends AbstractDOMObserver {

  start() {
    LOG('starting opening name observer');
    this._observer = new MutationObserver((mutations, obj) => {
      const openingName = openingElementToName(this._target);
      this._notifyHandlers({
        type: 'openingName',
        name: openingName,
      });
    });
    this._observer.observe(this._target, {
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
