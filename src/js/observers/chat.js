'use strict';

import { LOG } from '../utils';

const isChatGameMessage = (e, gameId) => {
  return e.classList && e.classList.contains('chat-message-component')
  && e.hasAttribute('data-notification')
  && e.getAttribute('data-message-id') === `game-${gameId}`;
}

const chatGameMessageToEvent = (elem) => {
  const eventType = elem.getAttribute('data-notification');
  const gameId = elem.getAttribute('data-message-id').split('-', 2)[1];

  // TODO: handle gameDrawDeclined, gameDrawAccepted, gameDrawOffered events, what exact HTML nodes represent those events?
  if (eventType === 'gameNewGamePlaying' || eventType === 'gameNewGameObserving') {
    const players = elem.querySelectorAll('.username');
    const whiteUsername = players[0].getAttribute('data-username');
    const blackUsername = players[1].getAttribute('data-username');
    return {
      type: 'started',
      mode: eventType === 'gameNewGamePlaying' ? 'playing' : 'observing',
      whiteUsername,
      blackUsername,
    };
  } else if (eventType === 'gameOver') {
    const possibleDrawText = elem.querySelector('a').textContent.toLowerCase();
    if (possibleDrawText.startsWith('game drawn')) {
      // TODO: is 50 move-rule indeed communicated by that exact string?
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
    const reasons = ['game abandoned', 'on time', 'by checkmate', 'by resignation'];
    const text = usernameElem.nextElementSibling.textContent.trim().toLowerCase();
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
  }
  return null;
};

class ChatObserver {

  constructor(target, parent, gameId) {
    this.elem = target;
    this.parent = parent;
    this.gameId = gameId;
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
    LOG('message observing started...');
    this.observer = new MutationObserver((mutations, obj) => {
      for (let mutation of mutations) {
        if (mutation.type === 'childList') {
          for (let i = 0; i < mutation.addedNodes.length; ++i) {
            const node = mutation.addedNodes.item(i);
            if (isChatGameMessage(node, this.gameId)) {
              const event = chatGameMessageToEvent(node);
              if (event) {
                this.notifyHandlers(event);
              }
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
  isChatGameMessage,
  chatGameMessageToEvent,
  ChatObserver,
};
