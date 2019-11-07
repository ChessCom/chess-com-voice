'use strict';

class Game {
  constructor(id, whiteUsername, blackUsername) {
    this.id = id;
    this.whiteUsername = whiteUsername;
    this.blackUsername = blackUsername;
    this.ended = false;
    this.moves = [];
  }

  currentPlayerUsername() {
    return [this.whiteUsername, this.blackUsername][this.moves.length % 2];
  }
  currentPlayerColor() {
    return ['white', 'black'][this.moves.length % 2];
  }

  colorOfUsername(username) {
    if (username === this.whiteUsername) {
      return 'white';
    } else if (username === this.blackUsername) {
      return 'black';
    }
    console.assert(false, `${username} does not participate in game ${this.id}`);
  }

  end() {
    this.ended = true;
  }

  pushMove(san) {
    this.moves.push(san);
  }
};

export { Game };
