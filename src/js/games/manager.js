'use strict';

import { Game } from './game';
import { LOG } from '../utils';

class GamesManager {
  constructor() {
    this._games = {};
    this._listeners = {
      'start': [],
      'move': [],
      'opening': [],
      'end': [],
      'idle': [],
      'time': [],
      'drawOffered': [],
      'drawDeclined': [],
    };
  }

  addListener(type, listener) {
    if (Array.isArray(this._listeners[type])) {
      this._listeners[type].push(listener);
    }
  }

  _notifiListeners(type, message) {
    this._listeners[type].forEach(l => l(message));
  }

  _initializeGame({ gameId, gameStateEvents, moveEvents, openingName }) {
    let game = null;
    for (const gameStateEvent of gameStateEvents) {
      const { type, ...params } = gameStateEvent;
      if (type === 'started') {
        game = new Game(gameId, params.whiteUsername, params.blackUsername);
        if (openingName) {
          game.addOpening(openingName);
        }
        moveEvents.forEach(e => game.pushMove(e.san));
        this._games[gameId] = game;
      } else if (type === 'ended') {
        game.end();
      }
    }
    // we consider the game as just started iff. it hasn't ended and no moves were made yet
    if (game && !game.ended && game.moves.length === 0) {
      this._notifiListeners('start', {
        gameId: game.id,
        whiteUsername: game.whiteUsername,
        blackUsername: game.blackUsername,
      });
    }
  }

  handleEvent({ type, gameId, ...params }) {
    LOG('got event=' + JSON.stringify({ type, gameId, ...params }));
    if (type === 'init') {
      this._initializeGame({ gameId, ...params });
    } else {
      const game = this._games[gameId];
      if (!game || game.ended) {
        return;
      }
      const now = Date.now();
      if (type === 'ping') {
        this._notifiListeners('idle', {
          seconds: game.idle,
          playerColor: game.currentPlayerColor,
        });
      } else if (type === 'time') {
        this._notifiListeners('time', { gameId, ...params });
      } else {
        if (type === 'ended') {
          game.end();
          const winnerColor = game.colorOfUsername(params.winnerUsername);
          LOG(`winnerColor=${winnerColor}`);
          this._notifiListeners('end', { gameId, winnerColor, ...params });
        } else if (type === 'move') {
          this._notifiListeners('move', {
            gameId,
            playerColor: game.currentPlayerColor,
            playerUsername: game.currentPlayerUsername,
            ...params
          });
          game.pushMove(params.san);
        } else if (type === 'openingName') {
          const { name } = params;
          if (!game.hasOpening(name)) {
            game.addOpening(name);
            this._notifiListeners('opening', { gameId, ...params });
          }
        } else if (type === 'drawOffered') {
          const { playerUsername } = params;
          const playerColor = game.colorOfUsername(playerUsername);
          this._notifiListeners('drawOffered', { gameId, playerColor, ...params });
        } else if (type === 'drawDeclined') {
          const { playerUsername } = params;
          const playerColor = game.colorOfUsername(playerUsername);
          this._notifiListeners('drawDeclined', { gameId, playerColor, ...params });
        }
      }
    }
  }
}

export { GamesManager };
