'use strict';

import { Game } from './game';
import { LOG } from '../utils';

class GamesManager {
  constructor() {
    this.games = {};
    this.seenOpenings = {};
    this.listeners = {
      'start': [],
      'move': [],
      'opening': [],
      'end': [],
    }
  }

  addListener(type, listener) {
    if (Array.isArray(this.listeners[type])) {
      this.listeners[type].push(listener);
    }
  }

  initializeGame(gameId, { gameStateEvents, moveEvents, openingName }) {
    let game = null;
    for (const gameStateEvent of gameStateEvents) {
      const { type, ...params } = gameStateEvent;
      if (type === 'started') {
        this.games[gameId] = new Game(gameId, params.whiteUsername, params.blackUsername);
        this.seenOpenings[gameId] = openingName ? [openingName] : [];
        game = this.games[gameId];
        moveEvents.forEach(e => game.pushMove(e.san));
      } else if (type === 'ended') {
        game.end();
      }
    }
    // we consider the game as just started iff. it hasn't ended and no moves were made yet
    if (game && !game.ended && game.moves.length === 0) {
      this.listeners['start'].forEach(l => l({
        gameId,
        whiteUsername: game.whiteUsername,
        blackUsername: game.blackUsername,
      }));
    }
  }

  handleEvent(gameId, { type, ...params }) {
    if (type === 'init') {
      this.initializeGame(gameId, params);
    } else {
      const game = this.games[gameId];
      if (!game) {
        return;
      }
      if (type === 'ended' && !game.ended) {
        game.end();
        const winnerColor = game.colorOfUsername(params.winnerUsername);
        this.listeners['end'].forEach(l => l({ gameId, winnerColor, ...params }));
      } else if (type === 'move' && !game.ended) {
        this.listeners['move'].forEach(l => l({
          gameId,
          playerColor: game.currentPlayerColor(),
          playerUsername: game.currentPlayerUsername(),
          ...params
        }));
        game.pushMove(params.san);
      } else if (type === 'openingName') {
        const { name } = params;
        const seenOpenings = this.seenOpenings[gameId];
        if (seenOpenings.includes(name)) {
          return;
        }
        seenOpenings.push(name);
        this.listeners['opening'].forEach(l => l({ gameId, ...params }));
      }
    }
  }
}

export { GamesManager };
