'use strict';

import { LOG } from '../utils';
import { AbstractDOMObserver } from './abstract';
import { ChatObserver, isChatGameMessage, chatGameMessageToEvent } from './chat';
import { MovesObserver, moveElementToEvent } from './moves';
import { OpeningObserver, openingElementToName } from './opening';
import { TimeObserver } from './time';
import { PingObserver } from './ping';

class LiveGameObserver extends AbstractDOMObserver {
  constructor(target, pingFrequency) {
    super(target);
    this._pingFrequency = pingFrequency;
    this._gameId = null;
  }

  _prepareEvent(event) {
    return { gameId: this._gameId, ...event };
  }

  initChildren() {
    const chatForPlayedGame = this._target.querySelector('.chat-scroll-area-component');
    const chatForObservedGame = this._target.querySelector('.chat-stream-component');
    const chatStreamElem = chatForPlayedGame ? chatForPlayedGame : chatForObservedGame;
    const movesForPlayedGame = this._target.querySelector('.vertical-move-list');
    const movesForObservedGame = this._target.querySelector('.vertical-move-list-component');
    const movesListElem = movesForPlayedGame ? movesForPlayedGame : movesForObservedGame;
    const openingNameElem = this._target.querySelector('.board-opening-name');
    const whiteTimeElem = this._target.querySelector('.clock-white');
    const blackTimeElem = this._target.querySelector('.clock-black');

    const gameStateEvents = Array.from(chatStreamElem.children)
    .map(msg => chatGameMessageToEvent(msg))
    .filter(e => e);

    const moveEvents = Array.from(movesListElem.querySelectorAll('.move .node'))
    .map(e => moveElementToEvent(e));

    this._notifyHandlers({
      type: 'init',
      gameStateEvents,
      moveEvents,
      openingName: openingElementToName(openingNameElem),
    });

    const children = [
      new ChatObserver(chatStreamElem, this._gameId),
      new MovesObserver(movesListElem),
      new OpeningObserver(openingNameElem),
      new TimeObserver(whiteTimeElem, 'white'),
      new TimeObserver(blackTimeElem, 'black'),
      new PingObserver(this._pingFrequency),
    ];
    children.forEach(c => this.addChild(c));
  }

  start() {
    LOG('observing started...');
    this._observer = new MutationObserver((mutations, obj) => {
      for (let mutation of mutations) {
        if (mutation.type === 'childList') {
          for (let i = 0; i < mutation.addedNodes.length; ++i) {
            const node = mutation.addedNodes.item(i);
            if (node.id && node.id.startsWith('chat-boards-')) {

              // looks like id of node is chat-board- followed by 0 followed by gameID, is this true?
              this._gameId = node.id.substr(13);

              // we set timeout so that initial moves list and opening name have time to load
              // maybe this should be done in a better way?
              setTimeout(() => {
                this.stopChildren();
                this.clearChildren();
                this.initChildren();
                this.startChildren();
              }, 100);
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

export { LiveGameObserver };
