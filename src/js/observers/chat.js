'use strict';

import { LOG } from '../utils';
import { AbstractDOMObserver } from './abstract';

const isChatGameMessage = (e, gameId) => {
  return e.classList && e.classList.contains('chat-message-component')
  && e.hasAttribute('data-notification')
  && e.getAttribute('data-message-id') === `game-${gameId}`;
}

const chatGameMessageToEvent = (elem) => {
  // TODO: handle gameDrawDeclined, gameDrawAccepted, gameDrawOffered events, what exact HTML nodes represent those events?
  if (elem.className === 'live-game-start-component' || elem.className === 'gameNewGameObserving') {
    const players = elem.querySelectorAll('.username');
    const whiteUsername = players[0].getAttribute('data-username');
    const blackUsername = players[1].getAttribute('data-username');
    return {
      type: 'started',
      mode: elem.className === 'live-game-start-component' ? 'playing' : 'observing',
      whiteUsername,
      blackUsername,
    };
  } else if (elem.className === 'gameOver') {
    const possibleDrawText = elem.querySelector('a').textContent.toLowerCase();
    if (possibleDrawText.startsWith('game drawn') || possibleDrawText.startsWith('draw')) {
      // usually starts with 'game drawn' by there is at least one case when it starts with 'draw':
      // 'Draw: Black ran out of time, but White has insufficient material'
      const reasons = ['stalemate', 'insufficient material', '50 move-rule', 'repetition', 'agreement'];
      let drawnBy = undefined;
      for (const reason of reasons) {
        if (possibleDrawText.includes(reason)) {
          drawnBy = reason;
          break;
        }
      }
      return {
        type: 'ended',
        draw: true,
        drawnBy,
      };
    }
    const usernameElem = elem.querySelector('.username');
    const winnerUsername = usernameElem.getAttribute('data-username');
    const reasons = ['game abandoned', 'time', 'checkmate', 'resignation'];
    const text = usernameElem.nextSibling.textContent.trim().toLowerCase();
    let wonBy = undefined;
    for (const reason of reasons) {
      if (text.includes(reason)) {
        wonBy = reason;
        break;
      }
    }
    return {
      type: 'ended',
      draw: false,
      winnerUsername,
      wonBy,
    };
  } else if (elem.className === 'live-game-draw-offer-component') {
    // TODO: check what happens textContent begins with player's title if the player has title
    const playerUsername = elem.textContent.split(' ')[0];
    return {
      type: 'drawOffered',
      playerUsername,
    };
  } else if (elem.className === 'gameDrawDeclined') {
    // TODO: check what happens textContent begins with player's title if the player has title
    const playerUsername = elem.textContent.split(' ')[0];
    return {
      type: 'drawDeclined',
      playerUsername,
    };
  }
  return null;
};

class ChatObserver extends AbstractDOMObserver {

  constructor(target, gameId) {
    super(target);
    this._gameId = gameId;
  }

  start() {
    LOG('message observing started...');
    this._observer = new MutationObserver((mutations, obj) => {
      for (let mutation of mutations) {
        if (mutation.type === 'childList') {
          for (let i = 0; i < mutation.addedNodes.length; ++i) {
            const node = mutation.addedNodes.item(i);
            if (isChatGameMessage(node, this._gameId)) {
              const event = chatGameMessageToEvent(node);
              if (event) {
                this._notifyHandlers(event);
              }
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
  isChatGameMessage,
  chatGameMessageToEvent,
  ChatObserver,
};
