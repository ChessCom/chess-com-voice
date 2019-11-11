'use strict';

import { LOG } from './utils';
import { GamesObserver } from './observers';
import { GamesManager } from './games';

import { DefaultVoice } from './audio';

import { makeAudioPath, AudioSequence, PlayQueue } from './audio/utils';

const app = () => {

  // TODO: set volume from user settings and act appropriately when user changes volume
  const voice = new DefaultVoice(0.6);

  let chatElem = document.querySelector('.sidebar-tabsetBottom');
  if (chatElem !== null) {
    const manager = new GamesManager();
    manager.addListener('start', ({ gameId, whiteUsername, blackUsername }) => {
      LOG(`new game started, gameId=${gameId} whiteUsername=${whiteUsername} blackUsername=${blackUsername}`);
    });
    manager.addListener('end', ({ gameId, ...params }) => {
      if (params.draw) {
        LOG(`game ended in a draw, reason=${params.drawnBy}`);
        voice.draw({ reason: params.drawnBy });
      } else {
        LOG(`game ended, winnerColor=${params.winnerColor}, winnerUsername=${params.winnerUsername} wonBy=${params.wonBy}`);
        voice.win(({ winnerColor: params.winnerColor, reason: params.wonBy.split(' ')[1] }));
      }
    });

    manager.addListener('move', ({ gameId, playerUsername, playerColor, san, ...params }) => {
      LOG(`${playerColor} (${playerUsername}) played ${san}`);
      voice.move({ san });
    });

    manager.addListener('opening', ({ gameId, name }) => {
      LOG(`We have opening ${name}`);
    });

    const gamesObserver = new GamesObserver(chatElem);
    gamesObserver.addHandler(manager);
    gamesObserver.start();
  }
};

export { app };
