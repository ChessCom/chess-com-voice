'use strict';

import { LOG } from '../utils';
import { AbstractDOMObserver } from './abstract';
import { ChatObserver, chatGameMessageToEvent } from './chat';
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

  _movesListElement() {
    const movesForPlayedGame = this._target.querySelector('.vertical-move-list');
    const movesForObservedGame = this._target.querySelector('.vertical-move-list-component');
    return movesForPlayedGame ? movesForPlayedGame : movesForObservedGame;
  }

  initAndStartChildren() {
    const chatForPlayedGame = this._target.querySelector('.chat-scroll-area-component');
    const chatForObservedGame = this._target.querySelector('.chat-stream-component');
    const chatStreamElem = chatForPlayedGame ? chatForPlayedGame : chatForObservedGame;
    const movesListElem = this._movesListElement();
    const openingForPlayedGame = this._target.querySelector('.eco-opening-name');
    const openingForObservedGame = this._target.querySelector('.board-opening-name');
    const openingNameElem = openingForPlayedGame ? openingForPlayedGame : openingForObservedGame;
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

    this._replaceMovesObserver(new MovesObserver(movesListElem));

    const children = [
      new ChatObserver(chatStreamElem, this._gameId),
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
        this._handleBoardNodeAdded(mutation);
        this._handleMovesListChanged(mutation);
      }
    })
    .observe(this._target, {
      attributes: false,
      childList: true,
      subtree: true,
      characterData: false,
    });
  }

  _handleBoardNodeAdded(mutation) {
    if (mutation.type === 'childList' && mutation.target.id === 'board-layout-chessboard') {
      for (let i = 0; i < mutation.addedNodes.length; ++i) {
        const node = mutation.addedNodes.item(i);
        if (node.id && node.id.startsWith('board-liveGame-')) {
          // looks like id of node is board-liveGame- followed by 0 followed by gameID, is this true?
          const nodeGameId = node.id.slice('board-liveGame-'.length);

          if (this._gameId === nodeGameId) {
            break;
          }

          this._gameId = nodeGameId;

          // we set timeout so that initial moves list and opening name have time to load
          // maybe this should be done in a better way?
          setTimeout(() => {
            this.stopChildren();
            this.clearChildren();
            this.initAndStartChildren();
          }, 100);
        }
      }
    }
  }

  _handleMovesListChanged(mutation) {
    if (mutation.type === 'childList' && mutation.target.className === 'sidebar-component') {
      const wasTabPanelPossiblyReplaced = mutation.addedNodes.length === 0;

      if (wasTabPanelPossiblyReplaced) {
        setTimeout(() => {
          const movesElement = this._movesListElement();
          if (movesElement) {
            this._replaceMovesObserver(new MovesObserver(movesElement));
          }
        }, 100);
      }
    }
  }

  _replaceMovesObserver(newMovesObserver) {
    if (this._movesObserver) {
      this._movesObserver.stop();
      const index = this._children.indexOf(this._movesObserver);
      if (index !== -1) {
        this._children.splice(index, 1);
      }
    }

    this._movesObserver = newMovesObserver;
    this.addChild(newMovesObserver);
    this._movesObserver.start();
  }
}

export { LiveGameObserver };
