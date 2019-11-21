'use strict';

import { LOG } from '../utils';
import { ChatObserver, isChatGameMessage, chatGameMessageToEvent } from './chat';
import { MovesObserver, moveElementToEvent } from './moves';
import { OpeningObserver, openingElementToName } from './opening';
import { PingObserver } from './ping';

class GamesObserver {
  constructor(chatElem, pingFrequency) {
    this.handlers = [];
    this.observer = null;
    this.gameId = null;
    this.childObservers = [];
    this.pingFrequency = pingFrequency;
  }

  addHandler(handler) {
    this.handlers.push(handler);
    return this;
  }

  notifyHandlers(event) {
    this.handlers.forEach(h => h.handleEvent(this.gameId, event));
  }

  stop() {
    if (this.observer) {
      this.childObservers.forEach(o => o.stop());
      this.observer.disconnect();
    }
  }

  start() {
    LOG('observing started...');
    this.observer = new MutationObserver((mutations, obj) => {
      for (let mutation of mutations) {
        if (mutation.type === 'childList') {
          for (let i = 0; i < mutation.addedNodes.length; ++i) {
            const node = mutation.addedNodes.item(i);
            if (node.id && node.id.startsWith('chat-boards-')) {

              this.gameId = node.id.substr(13); // looks like id of node is chat-board- followed by 0 followed by gameID, is this true?

              for (let observer of this.childObservers) {
                observer.stop();
              }

              const initAndStartObserving = () => {
                const chatStreamElem = document.querySelector('.chat-stream-component');
                const movesListElem = document.querySelector('.vertical-move-list-component').querySelector('div');
                const openingNameElem = document.querySelector('.board-opening-name');

                const gameStateEvents = Array.from(chatStreamElem.querySelectorAll('.chat-message-component'))
                .filter(msg => isChatGameMessage(msg, this.gameId))
                .map(msg => chatGameMessageToEvent(msg))
                .filter(e => e);

                const moveEvents = Array.from(movesListElem.querySelectorAll('.move-text-component'))
                .map(e => moveElementToEvent(e));

                this.notifyHandlers({
                  type: 'init',
                  gameStateEvents,
                  moveEvents,
                  openingName: openingElementToName(openingNameElem),
                });

                const chatObserver = new ChatObserver(chatStreamElem, this.gameId, this);
                const movesObserver = new MovesObserver(movesListElem, this);
                const openingObserver = new OpeningObserver(openingNameElem, this);
                const pingObserver = new PingObserver(this.pingFrequency, this.gameId, this);

                this.childObservers = [chatObserver, movesObserver, openingObserver, pingObserver];
                this.childObservers.forEach(o => o.start());
              }
              // we set timeout so that initial moves list and opening name have time to load
              // maybe this should be done in a better way?
              setTimeout(initAndStartObserving, 500);
            }
          }
        }
      }
    })
    .observe(document, {
      attributes: false,
      childList: true,
      subtree: true,
      characterData: false,
    });
  }
}

export { GamesObserver };
