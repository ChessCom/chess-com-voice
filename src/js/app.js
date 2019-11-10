'use strict';

import { LOG } from './utils';
import { GamesObserver } from './observers';
import { GamesManager } from './games';

import { sanToDefaultSoundsPaths } from './audio/sanparsing';
import { getDrawAudio, getWinAudio } from './audio/gameevents';
import { AudioSequence, Player } from './audio/player';

const app = () => {

  const player = new Player();
  let chatElem = document.querySelector('.sidebar-tabsetBottom');
  if (chatElem !== null) {
    const manager = new GamesManager();
    manager.addListener('start', ({ gameId, whiteUsername, blackUsername }) => {
      LOG(`new game started, gameId=${gameId} whiteUsername=${whiteUsername} blackUsername=${blackUsername}`);
      //playSound('start_just');
    });
    manager.addListener('end', ({ gameId, ...params }) => {
      if (params.draw) {
        LOG(`game ended in a draw, reason=${params.drawnBy}`);
        const drawAudio = getDrawAudio(params.drawnBy);
        player.enqueue(drawAudio);
      } else {
        LOG(`game ended, winnerColor=${params.winnerColor}, winnerUsername=${params.winnerUsername} wonBy=${params.wonBy}`);
        const winAudio = getWinAudio({ winnerColor: params.winnerColor, reason: params.wonBy.split(' ')[1]});
        player.enqueue(winAudio);
      }
    });

    manager.addListener('move', ({ gameId, playerUsername, playerColor, san, ...params }) => {
      LOG(`${playerColor} (${playerUsername}) played ${san}`);
      const sanAudio = new AudioSequence(sanToDefaultSoundsPaths(san));
      player.enqueue(sanAudio);
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
